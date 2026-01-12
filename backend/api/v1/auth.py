from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...schemas.user import UserCreate, UserResponse
from ...core.database import get_db
from ...core.confing import settings  # Предполагаю, что ты имел в виду config, но если confing - то так и оставь
from ...core.security import validate_telegram_webapp_data

router = APIRouter(prefix="/auth")

def get_db_session():
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

@router.post("/")
async def authenticate_user(init_data: str, db: Session = Depends(get_db_session)): # Исправлено: init_data: str
    if not validate_telegram_webapp_data(init_data, settings.TG_BOT_TOKEN):
        raise HTTPException(status_code=401, detail="Invalid authentication")
    
    # Здесь будет логика обработки initData и создания/обновления пользователя
    # Пока просто возвращаем успех
    return {"status": "authenticated", "message": "Welcome, ninja!"} # return внутри тела функции - всё ок