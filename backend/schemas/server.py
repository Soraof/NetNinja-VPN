# backend/schemas/server.py
from pydantic import BaseModel
from typing import Optional

class ServerResponse(BaseModel):
    id: int
    ip_address: str
    location: str
    hostname: str
    endpoint: str
    is_active: bool

    class Config:
        from_attributes = True