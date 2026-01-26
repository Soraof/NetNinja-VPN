# backend/tasks/reset_daily_missions.py
from celery import Celery
from core.config import settings
from sqlalchemy.orm import Session
from core.database import get_db
from models.mission import Mission
from models.user import User
from datetime import datetime, date

celery = Celery(__name__)
celery.conf.broker_url = settings.CELERY_BROKER_URL

@celery.task
def reset_daily_missions():
    """Сбрасывает ежедневные миссии для всех пользователей"""
    db: Session = next(get_db())
    try:
        # Найти все активные ежедневные миссии и сбросить их статус
        today = date.today()
        
        # Удалить старые дневные миссии
        from sqlalchemy import and_
        old_missions = db.query(Mission).filter(
            Mission.mission_type == 'daily',
            Mission.created_at < today
        ).delete()
        
        # Создать новые миссии для пользователей
        users = db.query(User).filter(User.is_active == True).all()
        
        for user in users:
            # Создать новые ежедневные миссии
            from models.mission import Mission as MissionModel
            new_missions = [
                MissionModel(
                    user_id=user.id,
                    title="Connect VPN",
                    description="Connect to VPN at least once today",
                    reward_amount=50,
                    reward_type="ryo",
                    mission_type="daily",
                    completed=False,
                    target_value=1,
                    current_progress=0
                ),
                MissionModel(
                    user_id=user.id,
                    title="Invite Friend",
                    description="Share referral link with someone",
                    reward_amount=100,
                    reward_type="ryo",
                    mission_type="daily",
                    completed=False,
                    target_value=1,
                    current_progress=0
                )
            ]
            db.add_all(new_missions)
        
        db.commit()
        print(f"Reset daily missions for {len(users)} users")
    except Exception as e:
        print(f"Error in reset_daily_missions: {e}")
        db.rollback()
    finally:
        db.close()