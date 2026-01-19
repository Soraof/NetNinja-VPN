from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import os

# Преобразуем относительный путь в абсолютный для надёжности
db_path = settings.DATABASE_URL.replace("sqlite:///", "")
absolute_db_path = os.path.abspath(db_path)
db_url = f"sqlite:///{absolute_db_path}"

engine = create_engine(
    db_url,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={"check_same_thread": False}  # Для SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Инициализирует таблицы в базе данных"""
    Base.metadata.create_all(bind=engine)