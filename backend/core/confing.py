from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/netninja")
    TG_BOT_TOKEN: str = os.getenv("TG_BOT_TOKEN")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    WG_ENDPOINT: str = os.getenv("WG_ENDPOINT", "http://vpn-service:8080")

settings = Settings()