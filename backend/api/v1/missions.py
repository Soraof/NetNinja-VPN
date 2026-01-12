# backend/api/v1/missions.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...schemas.mission import MissionCreate, MissionResponse
from ...core.database import get_db
from ...models.mission import Mission
from ...models.user import User
from datetime import datetime, timedelta

router = APIRouter(prefix="/missions", tags=["Missions"])

@router.get("/daily/{telegram_id}", response_model=list[MissionResponse])
async def get_daily_missions(telegram_id: str, db: Session = Depends(get_db)):
    """
    Получить ежедневные миссии для пользователя.
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Находим миссии, созданные сегодня для этого пользователя, которые являются daily
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)

    daily_missions = db.query(Mission).filter(
        Mission.user_id == user.id,
        Mission.is_daily == True,
        Mission.created_at >= today_start,
        Mission.created_at < today_end
    ).all()

    # Если миссий на сегодня нет, можно сгенерировать их
    if not daily_missions:
        # Пример генерации миссий (в реальности это может быть сложнее)
        sample_missions = [
            {"title": "Connect to VPN", "description": "Connect to any server", "reward_xp": 10},
            {"title": "Share App", "description": "Send link to friend", "reward_xp": 15},
            {"title": "Rate App", "description": "Give 5 stars in Telegram", "reward_xp": 20},
        ]
        for m in sample_missions:
            new_mission = Mission(
                user_id=user.id,
                title=m["title"],
                description=m["description"],
                reward_xp=m["reward_xp"],
                is_daily=True
            )
            db.add(new_mission)
        db.commit()
        # Заново получаем созданные миссии
        daily_missions = db.query(Mission).filter(
            Mission.user_id == user.id,
            Mission.is_daily == True,
            Mission.created_at >= today_start,
            Mission.created_at < today_end
        ).all()

    return daily_missions

@router.post("/complete/{mission_id}")
async def complete_mission(mission_id: int, telegram_id: str, db: Session = Depends(get_db)):
    """
    Отметить миссию как выполненную и начислить награду.
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    mission = db.query(Mission).filter(
        Mission.id == mission_id,
        Mission.user_id == user.id
    ).first()

    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found or does not belong to user")

    if mission.completed_at:
        raise HTTPException(status_code=400, detail="Mission already completed")

    # Отметить как выполненную
    mission.completed_at = datetime.utcnow()
    # Начислить XP
    user.xp += mission.reward_xp
    # Потенциально начислить звезды (требует интеграции с Telegram Bot API для отправки подарков)

    db.commit()
    db.refresh(mission)

    return {"message": f"Mision '{mission.title}' completed! +{mission.reward_xp} XP", "mission": mission}