from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./netninja.db"  # Относительный путь
    # Остальные поля как есть
    TG_BOT_TOKEN: str
    SECRET_KEY: str = "your-secret-key-here"
    WG_ENDPOINT: str = "http://vpn-service:8080"
    STARS_WEBHOOK_SECRET: str
    YOOKASSA_SHOP_ID: str = ""
    YOOKASSA_API_KEY: str = ""
    REDIS_URL: str = "redis://localhost:6379"

    class Config:
        env_file = ".env"  # Используется .env (можно переопределить)
        env_file_encoding = "utf-8"

settings = Settings()