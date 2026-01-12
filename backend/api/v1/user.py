from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...schemas.user import UserResponse, UserUpdate
from ...core.database import get_db
from ...models.user import User
from ...core.confing import settings
import uuid
from datetime import datetime

router = APIRouter(prefix="/user", tags=["User"])

def generate_referral_code():
    """Генерирует уникальный код для рефералки."""
    return f"ref_{str(uuid.uuid4().hex[:8])}"

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(telegram_id: str, db: Session = Depends(get_db)):
    """
    Получить профиль пользователя по его telegram_id.
    В реальной реализации telegram_id будет получен из аутентификации.
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(telegram_id: str, user_update: UserUpdate, db: Session = Depends(get_db)):
    """
    Обновить профиль пользователя.
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Обновляем поля, если они предоставлены
    for field, value in user_update.model_dump(exclude_unset=True).items():
        setattr(user, field, value)

    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)

    return user

@router.get("/level/{telegram_id}")
async def get_user_level(telegram_id: str, db: Session = Depends(get_db)):
    """
    Получить только уровень пользователя.
    """
    user = db.query(User.level).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"level": user.level}