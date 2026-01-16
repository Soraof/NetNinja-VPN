# backend/models/user.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from .base import Base
from datetime import datetime  # Импортируем datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    level = Column(Integer, default=1)  # 1-5 уровни ниндзя
    xp = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)  # Используем datetime.utcnow
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # onupdate может не работать с sqlite
    is_active = Column(Boolean, default=True)
    referral_code = Column(String, unique=True, index=True)
    referred_by = Column(String, nullable=True)  # telegram_id того, кто пригласил

    # Связи
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    vpn_peer = relationship("VPNPeer", back_populates="user", uselist=False)
    missions = relationship("Mission", back_populates="user")
    referrals = relationship("Referral", back_populates="referrer")