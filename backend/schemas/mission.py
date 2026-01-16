from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MissionCreate(BaseModel):
    title: str
    description: str
    reward_xp: int
    reward_stars: int
    is_daily: bool

class MissionResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    reward_xp: int
    reward_stars: int
    completed_at: Optional[datetime]
    is_daily: bool

    class Config:
        from_attributes = True