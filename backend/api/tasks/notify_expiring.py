# backend/tasks/notify_expiring.py
from celery import Celery
from core.config import settings
from sqlalchemy.orm import Session
from core.database import get_db
from models.subscription import Subscription
from services.telegram_notifier import send_notification

celery = Celery(__name__)
celery.conf.broker_url = settings.CELERY_BROKER_URL

@celery.task
def check_expiring_subscriptions():
    """Проверяет истекающие подписки и отправляет уведомления"""
    db: Session = next(get_db())
    try:
        # Найти подписки, которые истекают в ближайшие 3 дня
        from datetime import datetime, timedelta
        three_days_later = datetime.utcnow() + timedelta(days=3)
        
        expiring_subs = db.query(Subscription).filter(
            Subscription.expires_at <= three_days_later,
            Subscription.expires_at > datetime.utcnow(),
            Subscription.notified_expiring == False
        ).all()
        
        for sub in expiring_subs:
            # Отправить уведомление пользователю
            send_notification(
                chat_id=sub.user.telegram_id,
                message=f"⚠️ Ваша подписка истекает {sub.expires_at.strftime('%d.%m.%Y %H:%M')}. Пополните баланс!"
            )
            sub.notified_expiring = True
        
        db.commit()
    except Exception as e:
        print(f"Error in check_expiring_subscriptions: {e}")
        db.rollback()
    finally:
        db.close()