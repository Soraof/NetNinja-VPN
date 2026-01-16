# backend/api/v1/vpn.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
# Используем абсолютные импорты
from schemas.vpn_peer import VPNPeerCreate, VPNPeerResponse
from core.database import get_db
from models.vpn_peer import VPNPeer
from models.user import User
from models.server import Server
from services.wg_client import WGClient
from core.config import settings
import os

router = APIRouter(prefix="/vpn", tags=["VPN"])

wg_client = WGClient(settings.WG_ENDPOINT) # Инициализируем клиент

def get_db_session():
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

@router.post("/create", response_model=VPNPeerResponse)
async def create_vpn_config(vpn_data: VPNPeerCreate, db: Session = Depends(get_db_session)):
    # 1. Проверяем, что пользователь существует и имеет активную подписку
    user = db.query(User).filter(User.id == vpn_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Получаем сервер
    server = db.query(Server).filter(Server.id == vpn_data.server_id).first()
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")

    # 3. Генерируем уникальный IP для пира (упрощённо)
    assigned_ip = f"10.8.0.{vpn_data.user_id + 10}/32" # Пример

    # 4. Вызываем Go-сервис для добавления пира
    try:
        await wg_client.add_peer(vpn_data.public_key, assigned_ip)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add peer to WireGuard: {str(e)}")

    # 5. Генерируем .conf файл
    server_public_key = server.public_key
    server_endpoint = server.endpoint

    config_content = f"""[Interface]
PrivateKey = CLIENT_PRIVATE_KEY_PLACEHOLDER # Клиент должен заменить на свой
Address = {assigned_ip}
DNS = 1.1.1.1

[Peer]
PublicKey = {server_public_key}
AllowedIPs = 0.0.0.0/0
Endpoint = {server_endpoint}
PersistentKeepalive = 25
"""

    # 6. Сохраняем информацию о пире в БД
    new_peer = VPNPeer(
        user_id=vpn_data.user_id,
        public_key=vpn_data.public_key,
        private_key_encrypted="ENCRYPTED_CLIENT_PRIVATE_KEY", # Должно быть зашифровано
        config_content=config_content,
        allowed_ips=assigned_ip,
        server_id=vpn_data.server_id,
        is_active=True
    )
    db.add(new_peer)
    db.commit()
    db.refresh(new_peer)

    return new_peer


@router.get("/config/{user_id}")
async def get_vpn_config(user_id: int, db: Session = Depends(get_db_session)):
    """
    Получить .conf файл для пользователя.
    """
    peer = db.query(VPNPeer).filter(VPNPeer.user_id == user_id).first()
    if not peer:
        raise HTTPException(status_code=404, detail="VPN configuration not found")
    if not peer.is_active:
        raise HTTPException(status_code=400, detail="VPN configuration is not active")

    # Возвращаем конфиг как текст
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse(content=peer.config_content)