from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./netninja.db")
    TG_BOT_TOKEN: str = os.getenv("TG_BOT_TOKEN", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    WG_ENDPOINT: str = os.getenv("WG_ENDPOINT", "http://vpn-service:8080")
    STARS_WEBHOOK_SECRET: str = os.getenv("STARS_WEBHOOK_SECRET", "")
    YOOKASSA_SHOP_ID: str = os.getenv("YOOKASSA_SHOP_ID", "")
    YOOKASSA_API_KEY: str = os.getenv("YOOKASSA_API_KEY", "")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

settings = Settings()