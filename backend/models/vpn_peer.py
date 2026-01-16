# backend/models/vpn_peer.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base
from datetime import datetime  # Импортируем datetime

class VPNPeer(Base):
    __tablename__ = "vpn_peers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    public_key = Column(String, unique=True, nullable=False) # Public key клиента
    private_key_encrypted = Column(Text, nullable=False) # Зашифрованный приватный ключ
    config_content = Column(Text, nullable=False) # Содержимое .conf файла
    allowed_ips = Column(String, default="0.0.0.0/0") # IP-адрес клиента в VPN
    server_id = Column(Integer, ForeignKey("servers.id"))
    traffic_used_bytes = Column(Numeric, default=0) # Использованный трафик в байтах
    created_at = Column(DateTime, default=datetime.utcnow)  # Используем datetime.utcnow
    is_active = Column(Boolean, default=True)

    user = relationship("User", back_populates="vpn_peer")
    server = relationship("Server")