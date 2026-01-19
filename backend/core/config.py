# core/config.py
from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

class Settings(BaseSettings):
    DATABASE_URL: str = f"sqlite:///{BASE_DIR}/netninja.db"
    TG_BOT_TOKEN: str
    SECRET_KEY: str = "your-secret-key-here"
    WG_ENDPOINT: str = "http://vpn-service:8080"
    STARS_WEBHOOK_SECRET: str
    YOOKASSA_SHOP_ID: str = ""
    YOOKASSA_API_KEY: str = ""
    REDIS_URL: str = "redis://localhost:6379"

    class Config:
        env_file = BASE_DIR / ".env"
        env_file_encoding = "utf-8"

settings = Settings()