# backend/models/server.py
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from .base import Base

class Server(Base):
    __tablename__ = "servers"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String, unique=True, nullable=False)
    location = Column(String, nullable=False) # e.g., "DE", "NL", "SG"
    hostname = Column(String, nullable=False)
    public_key = Column(String, nullable=False) # Public key сервера WireGuard
    endpoint = Column(String, nullable=False) # e.g., "de.example.com:51820"
    is_active = Column(Boolean, default=True)

    peers = relationship("VPNPeer", back_populates="server")