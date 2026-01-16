# backend/models/mission.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Integer as SqlInt, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base
from datetime import datetime  # Импортируем datetime

class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    reward_xp = Column(SqlInt, default=0)
    reward_stars = Column(SqlInt, default=0)
    completed_at = Column(DateTime, nullable=True)
    is_daily = Column(Boolean, default=False) # True для ежедневных миссий
    created_at = Column(DateTime, default=datetime.utcnow)  # Используем datetime.utcnow

    user = relationship("User", back_populates="missions")