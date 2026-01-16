from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.user import UserResponse, UserUpdate 
from core.database import get_db
from models.user import User
from core.config import settings
from datetime import datetime
from typing import Dict, Any

router = APIRouter(prefix="/user", tags=["User"])


def get_db_session():
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

@router.get("/profile/{telegram_id}", response_model=UserResponse)
async def get_user_profile(telegram_id: str, db: Session = Depends(get_db_session)):
    """
    Получить профиль пользователя по Telegram ID
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.put("/profile/{telegram_id}", response_model=UserResponse)
async def update_user_profile(
    telegram_id: str, 
    user_update: UserUpdate, 
    db: Session = Depends(get_db_session)
):
    """
    Обновить профиль пользователя
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Получаем только измененные поля
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Дополнительная валидация при необходимости
    if 'username' in update_data and update_data['username']:
        # Проверяем уникальность username (если требуется)
        existing_user = db.query(User).filter(
            User.username == update_data['username'],
            User.telegram_id != telegram_id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=400, 
                detail="Username already taken"
            )
    
    # Обновляем поля
    for field, value in update_data.items():
        setattr(user, field, value)
    
    user.updated_at = datetime.utcnow()
    
    try:
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    return user

@router.get("/level/{telegram_id}")
async def get_user_level(telegram_id: str, db: Session = Depends(get_db_session)):
    """
    Получить уровень пользователя
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"level": user.level}

@router.get("/stats/{telegram_id}")
async def get_user_stats(telegram_id: str, db: Session = Depends(get_db_session)):
    """
    Получить статистику пользователя
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "telegram_id": user.telegram_id,
        "username": user.username,
        "level": user.level,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "updated_at": user.updated_at.isoformat() if user.updated_at else None,
        "total_referrals": getattr(user, 'total_referrals', 0),  # Если есть такое поле
        "is_active": getattr(user, 'is_active', True)
    }

@router.patch("/level/{telegram_id}")
async def update_user_level(
    telegram_id: str, 
    level_data: Dict[str, Any],  # или создай отдельную Pydantic схему
    db: Session = Depends(get_db_session)
):
    """
    Обновить уровень пользователя (только для админов)
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Здесь можно добавить проверку прав доступа
    # if not is_admin(current_user):
    #     raise HTTPException(status_code=403, detail="Not authorized")
    
    new_level = level_data.get('level')
    if new_level is None:
        raise HTTPException(status_code=400, detail="Level is required")
    
    # Валидация уровня
    if not isinstance(new_level, int) or new_level < 0:
        raise HTTPException(status_code=400, detail="Invalid level value")
    
    user.level = new_level
    user.updated_at = datetime.utcnow()
    
    try:
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    return {"message": "Level updated successfully", "level": user.level}

@router.delete("/profile/{telegram_id}")
async def delete_user_profile(
    telegram_id: str,
    db: Session = Depends(get_db_session)
):
    """
    Удалить профиль пользователя (мягкое удаление)
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Вариант 1: Мягкое удаление (рекомендуется)
    user.is_active = False
    user.deleted_at = datetime.utcnow()
    
    # Вариант 2: Полное удаление (осторожно!)
    # db.delete(user)
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    return {"message": "User deactivated successfully"}