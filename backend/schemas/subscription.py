# backend/schemas/subscription.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SubscriptionCreate(BaseModel):
    plan: str  # day, week, month, year
    duration_days: int

class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    plan: str
    starts_at: datetime
    expires_at: datetime
    is_active: bool

    class Config:
        from_attributes = True