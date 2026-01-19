from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.user import UserResponse, UserUpdate 
from core.database import get_db  # ← Используем напрямую
from models.user import User
from datetime import datetime
from typing import Dict, Any

router = APIRouter(tags=["User"])

@router.get("/profile/{telegram_id}", response_model=UserResponse)
async def get_user_profile(telegram_id: str, db: Session = Depends(get_db)):
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
    db: Session = Depends(get_db)  # ← Исправлено
):
    """
    Обновить профиль пользователя
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.model_dump(exclude_unset=True)
    
    if 'username' in update_data and update_data['username']:
        existing_user = db.query(User).filter(
            User.username == update_data['username'],
            User.telegram_id != telegram_id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
    
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
async def get_user_level(telegram_id: str, db: Session = Depends(get_db)):  # ← Исправлено
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"level": user.level}

@router.get("/stats/{telegram_id}")
async def get_user_stats(telegram_id: str, db: Session = Depends(get_db)):  # ← Исправлено
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "telegram_id": user.telegram_id,
        "username": user.username,
        "level": user.level,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "updated_at": user.updated_at.isoformat() if user.updated_at else None,
        "total_referrals": getattr(user, 'total_referrals', 0),
        "is_active": getattr(user, 'is_active', True)
    }

@router.patch("/level/{telegram_id}")
async def update_user_level(
    telegram_id: str, 
    level_data: Dict[str, Any],
    db: Session = Depends(get_db)  # ← Исправлено
):
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_level = level_data.get('level')
    if new_level is None:
        raise HTTPException(status_code=400, detail="Level is required")
    
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
    db: Session = Depends(get_db)  # ← Исправлено
):
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = False
    user.deleted_at = datetime.utcnow()
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    return {"message": "User deactivated successfully"}