from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import os

# Преобразуем относительный путь в абсолютный для надёжности
db_path = settings.DATABASE_URL.replace("sqlite:///", "")
absolute_db_path = os.path.abspath(db_path)
db_url = f"sqlite:///{absolute_db_path}"

print(f"Database path: {db_url}")  # Для отладки

engine = create_engine(
    db_url,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={"check_same_thread": False},  # Для SQLite
    echo=True  # Для отладки - покажет все SQL запросы
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
    print("Creating database tables...")
    # Импортируем все модели перед созданием таблиц
    from models.user import User
    from models.vpn_peer import VPNPeer
    from models.subscription import Subscription
    from models.mission import Mission
    from models.referral import Referral
    from models.server import Server
    
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")