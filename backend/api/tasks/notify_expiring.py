# backend/tasks/notify_expiring.py
# from celery import Celery
# from ...services.telegram_notifier import TelegramNotifier
# from ...core.config import settings
#
# app = Celery('tasks', broker=settings.CELERY_BROKER_URL) # Нужно добавить в .env
# notifier = TelegramNotifier(settings.TG_BOT_TOKEN)
#
# @app.task
# def check_and_notify_expiring_subscriptions():
#     """
#     Фоновая задача: проверяет, у кого заканчивается подписка и отправляет уведомления.
#     """
#     from ...services.database import get_db
#     from ...models.user import User
#     from ...models.subscription import Subscription
#     from datetime import datetime, timedelta
#
#     db_gen = get_db()
#     db = next(db_gen)
#     try:
#         now = datetime.utcnow()
#         # Найти активные подписки, заканчивающиеся в ближайшие N дней (например, 1)
#         expiring_date = now + timedelta(days=1)
#         expiring_subs = db.query(Subscription).filter(
#             Subscription.is_active == True,
#             Subscription.expires_at <= expiring_date,
#             Subscription.expires_at > now
#         ).all()
#
#         for sub in expiring_subs:
#             user = db.query(User).filter(User.id == sub.user_id).first()
#             if user:
#                 days_left = (sub.expires_at - now).days + 1
#                 notifier.notify_subscription_expiring(user.telegram_id, days_left)
#
#     finally:
#         next(db_gen, None)
#
# # Запускать эту задачу раз в день через планировщик Celery