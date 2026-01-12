# backend/models/referral.py
from sqlalchemy import Column, Integer, String, DateTime, Integer as SqlInt, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Referral(Base):
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True)
    referrer_telegram_id = Column(String, ForeignKey("users.telegram_id"), nullable=False) # telegram_id пригласившего
    referee_telegram_id = Column(String, nullable=False) # telegram_id приглашенного
    reward_xp = Column(SqlInt, default=0) # XP, полученный за реферала
    rewarded_at = Column(DateTime, nullable=True) # Когда был выдан бонус

    referrer = relationship("User", back_populates="referrals")