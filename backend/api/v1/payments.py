from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.config import settings
from models.user import User
from models.subscription import Subscription
import hashlib
import hmac
import json
from datetime import datetime, timedelta

router = APIRouter(prefix="/payments", tags=["Payments"])

def get_db_session():
    """Получение сессии БД"""
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

@router.post("/webhook")
async def handle_stars_webhook(request: Request, db: Session = Depends(get_db_session)):
    """
    Обработка вебхука от Telegram Stars.
    """
    try:
        # Получаем raw body
        body_bytes = await request.body()
        body_str = body_bytes.decode('utf-8')
        
        # Получаем заголовки
        headers = request.headers

        # 1. Проверяем X-Stars-Payment-Signature
        signature = headers.get("X-Stars-Payment-Signature")
        timestamp = headers.get("X-Stars-Payment-Timestamp")
        
        # Проверяем наличие секретного ключа
        webhook_secret = getattr(settings, "STARS_WEBHOOK_SECRET", "")
        if not webhook_secret:
            print("Warning: STARS_WEBHOOK_SECRET not set in settings")
            # В продакшене нужно выбрасывать ошибку
            # raise HTTPException(status_code=500, detail="Webhook secret not configured")
        
        # Проверка подписи (если есть секрет)
        if webhook_secret and signature:
            verification_string = f"{timestamp}\n{body_str}"
            
            expected_signature = hmac.new(
                webhook_secret.encode('utf-8'),
                verification_string.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()

            if not hmac.compare_digest(signature, expected_signature):
                raise HTTPException(status_code=401, detail="Invalid webhook signature")

        # 2. Парсим payload
        try:
            payload = json.loads(body_str)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON payload")

        # 3. Логируем полученный вебхук для отладки
        print(f"Received webhook: {json.dumps(payload, indent=2)}")

        # 4. Извлекаем данные
        # Структура может отличаться, адаптируй под документацию Telegram
        amount_data = payload.get('amount', {})
        amount = amount_data.get('total_amount')
        currency = amount_data.get('currency')
        invoice_payload = payload.get('invoice_payload')
        status = payload.get('status')
        transaction_id = payload.get('id')
        telegram_payment_charge_id = payload.get('telegram_payment_charge_id')

        # 5. Проверяем статус платежа
        if status != "completed":
            print(f"Payment not completed. Status: {status}")
            return {"status": "ok"}

        # 6. Проверяем валюту (XTR - Telegram Stars)
        if currency != "XTR":
            print(f"Unsupported currency: {currency}")
            return {"status": "ok"}

        # 7. Парсим invoice_payload
        if not invoice_payload:
            print("No invoice_payload found")
            return {"status": "ok"}

        # Ожидаемый формат: "user_id:plan" или "user_id:plan:some_extra_data"
        parts = invoice_payload.split(':')
        if len(parts) < 2:
            print(f"Invalid invoice_payload format: {invoice_payload}")
            return {"status": "ok"}

        user_telegram_id = parts[0]
        plan = parts[1].lower()  # day, week, month, year

        # 8. Находим пользователя
        user = db.query(User).filter(User.telegram_id == user_telegram_id).first()
        if not user:
            print(f"User not found: {user_telegram_id}")
            return {"status": "ok"}  # Все равно возвращаем OK

        # 9. Определяем период подписки
        plan_days = {
            "day": 1,
            "week": 7,
            "month": 30,
            "year": 365
        }
        
        if plan not in plan_days:
            print(f"Unknown plan: {plan}")
            return {"status": "ok"}
        
        days_to_add = plan_days[plan]

        # 10. Находим текущую активную подписку
        now = datetime.utcnow()
        active_subscription = db.query(Subscription).filter(
            Subscription.user_id == user.id,
            Subscription.is_active == True,
            Subscription.expires_at > now
        ).first()

        # 11. Создаем или продлеваем подписку
        if active_subscription:
            # Продлеваем существующую подписку
            active_subscription.expires_at = active_subscription.expires_at + timedelta(days=days_to_add)
            active_subscription.plan = plan
            active_subscription.updated_at = now
            print(f"Subscription extended for user {user_telegram_id}, plan: {plan}")
        else:
            # Создаем новую подписку
            new_subscription = Subscription(
                user_id=user.id,
                plan=plan,
                starts_at=now,
                expires_at=now + timedelta(days=days_to_add),
                is_active=True,
                telegram_payment_charge_id=telegram_payment_charge_id,
                transaction_id=transaction_id,
                amount=amount
            )
            db.add(new_subscription)
            print(f"New subscription created for user {user_telegram_id}, plan: {plan}")

        # 12. Обновляем пользователя (например, добавляем Stars)
        user.stars_balance = getattr(user, 'stars_balance', 0) + amount
        user.total_spent = getattr(user, 'total_spent', 0) + amount

        # 13. Сохраняем изменения
        db.commit()

        print(f"Payment processed successfully. User: {user_telegram_id}, Amount: {amount}, Plan: {plan}")

        # 14. Здесь можно добавить фоновые задачи:
        # - Отправка уведомления пользователю
        # - Начисление реферальных бонусов
        # - Активация VPN и т.д.

        return {"status": "ok"}

    except HTTPException:
        # Перевыбрасываем HTTP исключения
        raise
    except Exception as e:
        # Логируем любые другие ошибки
        print(f"Error processing webhook: {str(e)}")
        # В продакшене лучше не возвращать детали ошибки клиенту
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/test")
async def test_payments():
    """Тестовый эндпоинт для проверки работы роутера"""
    return {
        "message": "Payments router is working!",
        "webhook_url": "/api/v1/payments/webhook",
        "method": "POST"
    }

@router.post("/test-webhook")
async def test_webhook_simulation(request: Request, db: Session = Depends(get_db_session)):
    """
    Эндпоинт для тестирования вебхука (только для разработки!)
    """
    test_payload = {
        "id": "test_txn_123",
        "amount": {
            "total_amount": 100,
            "currency": "XTR"
        },
        "status": "completed",
        "invoice_payload": "123456789:month",
        "telegram_payment_charge_id": "test_charge_123"
    }
    
    # Имитируем вебхук
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    
    response = client.post(
        "/api/v1/payments/webhook",
        json=test_payload,
        headers={
            "X-Stars-Payment-Signature": "test_signature",
            "X-Stars-Payment-Timestamp": "1234567890"
        }
    )
    
    return {
        "test_sent": test_payload,
        "response": response.json() if response.status_code == 200 else {"error": response.text}
    }