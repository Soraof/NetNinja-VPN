# backend/api/v1/referrals.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
# Используем абсолютные импорты
from schemas.referral import ReferralCreate, ReferralResponse
from core.database import get_db
from models.referral import Referral
from models.user import User
from datetime import datetime
import uuid

router = APIRouter(prefix="/referrals", tags=["Referrals"])

def get_db_session():
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

@router.get("/{telegram_id}")
async def get_referral_link(telegram_id: str, db: Session = Depends(get_db_session)):
    """
    Получить реферальную ссылку пользователя.
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Ссылка формируется как base_url?startapp=ref_{code}
    # Базовый URL берётся из конфига или фронтенда
    referral_url = f"https://t.me/netninja_vpn_bot/app?startapp={user.referral_code}"
    return {"referral_url": referral_url}

@router.post("/register") # Вызовется, когда новый пользователь регистрируется по ссылке
async def register_referral(referrer_telegram_id: str, referee_telegram_id: str, db: Session = Depends(get_db_session)):
    """
    Зарегистрировать рефералку. Вызывается при регистрации нового пользователя.
    """
    referrer = db.query(User).filter(User.telegram_id == referrer_telegram_id).first()
    referee = db.query(User).filter(User.telegram_id == referee_telegram_id).first()

    if not referrer:
        raise HTTPException(status_code=404, detail="Referrer not found")
    if not referee:
        raise HTTPException(status_code=404, detail="Referee not found")

    # Проверить, что рефералка ещё не зарегистрирована
    existing_referral = db.query(Referral).filter(
        Referral.referrer_telegram_id == referrer_telegram_id,
        Referral.referee_telegram_id == referee_telegram_id
    ).first()

    if existing_referral:
        raise HTTPException(status_code=400, detail="Referral already registered")

    # Создать запись о рефералке
    new_referral = Referral(
        referrer_telegram_id=referrer_telegram_id,
        referee_telegram_id=referee_telegram_id,
        reward_xp=50 # Фиксированная награда, можно сделать гибко
    )

    db.add(new_referral)
    # Начислить XP пригласившему
    referrer.xp += new_referral.reward_xp

    db.commit()
    db.refresh(new_referral)

    return {"message": f"Referral registered! {referrer.username} gets +{new_referral.reward_xp} XP", "referral": new_referral}