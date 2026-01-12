# backend/schemas/referral.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReferralCreate(BaseModel):
    referrer_telegram_id: str
    referee_telegram_id: str
    reward_xp: int

class ReferralResponse(BaseModel):
    id: int
    referrer_telegram_id: str
    referee_telegram_id: str
    reward_xp: int
    rewarded_at: Optional[datetime]

    class Config:
        from_attributes = True