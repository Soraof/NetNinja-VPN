from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.user import UserCreate, UserResponse
from core.database import get_db  # Используем правильный путь
from core.config import settings
from core.security import validate_telegram_webapp_data, parse_init_data
from models.user import User
import uuid
import json

router = APIRouter(tags=["Auth"])

@router.post("/auth/")
async def authenticate_user(init_data: str, db: Session = Depends(get_db)):
    if not validate_telegram_webapp_data(init_data, settings.TG_BOT_TOKEN):
        raise HTTPException(status_code=401, detail="Invalid authentication")

    # Парсим initData
    user_data = parse_init_data(init_data)
    if not user_data or 'user' not in user_data:
        raise HTTPException(status_code=400, detail="No user data in init data")

    # Telegram возвращает user в JSON-строке
    tg_user = json.loads(user_data['user'])

    telegram_id = str(tg_user['id'])
    username = tg_user.get('username')
    first_name = tg_user.get('first_name')
    last_name = tg_user.get('last_name')

    # Проверяем, есть ли пользователь в БД
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        # Создаём нового пользователя
        referral_code = f"ref_{str(uuid.uuid4().hex[:8])}"
        new_user = User(
            telegram_id=telegram_id,
            username=username,
            first_name=first_name,
            last_name=last_name,
            referral_code=referral_code
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user = new_user

    return {"status": "authenticated", "message": "Welcome, ninja!", "user_id": user.id}