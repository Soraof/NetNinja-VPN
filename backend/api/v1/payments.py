# backend/api/v1/payments.py
from fastapi import APIRouter, Request, HTTPException
from ...core.config import settings
import hashlib
import hmac
import json

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("/webhook")
async def handle_stars_webhook(request: Request):
    """
    Обработка вебхука от Telegram Stars.
    """
    # Получаем raw body
    body = await request.body()
    # Получаем заголовки
    headers = request.headers

    # 1. Проверяем X-Stars-Payment-Signature
    signature = headers.get("X-Stars-Payment-Signature")
    timestamp = headers.get("X-Stars-Payment-Timestamp")
    webhook_secret = settings.STARS_WEBHOOK_SECRET # Должно быть в .env

    # Формируем строку для подписи: timestamp + body
    verification_string = f"{timestamp}\n{body.decode('utf-8')}"

    expected_signature = hmac.new(
        webhook_secret.encode('utf-8'),
        verification_string.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    if signature != expected_signature:
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    # 2. Парсим payload
    try:
        payload = json.loads(body.decode('utf-8'))
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    # 3. Обрабатываем событие
    # Пример структуры payload (может отличаться, см. документацию Telegram)
    # {
    #   "id": "txn_id",
    #   "amount": {"total_amount": 5, "currency": "XTR"},
    #   "paid_at": "...",
    #   "invoice_payload": "...", # Может содержать id пользователя или план
    #   "telegram_payment_charge_id": "...",
    #   "provider_payment_charge_id": "..."
    # }

    # --- Логика обработки ---
    amount = payload.get('amount', {}).get('total_amount')
    currency = payload.get('amount', {}).get('currency')
    invoice_payload = payload.get('invoice_payload') # Здесь может быть ID пользователя и план
    status = payload.get('status') # "completed", "failed", etc.

    if status == "completed":
        if currency == "XTR":
            # 4. Активируем/продлеваем подписку
            # Нужно распарсить invoice_payload, чтобы понять, кто купил и что
            # Пример: "user_id:plan"
            if invoice_payload:
                parts = invoice_payload.split(':')
                if len(parts) >= 2:
                    user_telegram_id = parts[0]
                    plan = parts[1]

                    # Импортируем модели и сессию для обновления БД
                    from sqlalchemy.orm import Session
                    from ...core.database import get_db
                    from ...models.subscription import Subscription
                    from ...models.user import User
                    from datetime import datetime, timedelta

                    # Это упрощённо. В идеале, использовать фоновую задачу Celery.
                    db_gen = get_db()
                    db: Session = next(db_gen)
                    try:
                        # Найти пользователя
                        user = db.query(User).filter(User.telegram_id == user_telegram_id).first()
                        if not user:
                            print(f"Warning: Payment for unknown user {user_telegram_id}")
                            return {"status": "ok"} # Всё равно отвечаем OK, чтобы Telegram не retry'ил

                        # Найти текущую или создать новую подписку
                        sub = db.query(Subscription).filter(
                            Subscription.user_id == user.id,
                            Subscription.is_active == True
                        ).order_by(Subscription.expires_at.desc()).first()

                        now = datetime.utcnow()
                        start_date = now
                        days_to_add = 0

                        if plan == "day":
                            days_to_add = 1
                        elif plan == "week":
                            days_to_add = 7
                        elif plan == "month":
                            days_to_add = 30
                        elif plan == "year":
                            days_to_add = 365
                        else:
                            print(f"Warning: Unknown plan {plan}")
                            return {"status": "ok"}

                        if sub and sub.expires_at > now:
                            # Продлеваем существующую
                            sub.expires_at = sub.expires_at + timedelta(days=days_to_add)
                            sub.plan = plan # Обновляем план на случай, если он меняется
                        else:
                            # Создаём новую
                            new_sub = Subscription(
                                user_id=user.id,
                                plan=plan,
                                starts_at=start_date,
                                expires_at=start_date + timedelta(days=days_to_add),
                                is_active=True
                            )
                            db.add(new_sub)

                        db.commit()
                        print(f"Payment successful for user {user_telegram_id}, plan {plan}, amount {amount}")

                    finally:
                        next(db_gen, None) # Закрываем сессию
                else:
                    print("Warning: Invalid invoice_payload format")
            else:
                print("Warning: No invoice_payload in webhook")
        else:
            print(f"Warning: Received payment in unsupported currency: {currency}")
    else:
        print(f"Received non-completed payment status: {status}")

    # 5. Всегда возвращаем OK
    return {"status": "ok"}
