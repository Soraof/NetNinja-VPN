from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class VPNPeerCreate(BaseModel):
    public_key: str
    user_id: int
    server_id: Optional[int] = None

class VPNPeerResponse(BaseModel):
    id: int
    public_key: str
    allowed_ips: str
    server_id: Optional[int]
    config_content: str
    is_active: bool

    class Config:
        from_attributes = True