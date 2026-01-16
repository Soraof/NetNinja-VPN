from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...schemas.vpn_peer import VPNPeerCreate, VPNPeerResponse
from ...core.database import get_db
from ...models.vpn_peer import VPNPeer
from ...models.user import User
from ...models.server import Server
from ..services.wg_client import WGClient
from ...core.config import settings
from fastapi.responses import PlainTextResponse  # Перенес импорт вверх
import os

router = APIRouter(prefix="/vpn", tags=["VPN"])

wg_client = WGClient(settings.WG_ENDPOINT)

def get_db_session():
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

@router.post("/create", response_model=VPNPeerResponse)
async def create_vpn_config(vpn_data: VPNPeerCreate, db: Session = Depends(get_db_session)):
    # Исправлено: было vpn_ VPNPeerCreate, стало vpn_data: VPNPeerCreate
    
    # Проверяем, что пользователь существует
    user = db.query(User).filter(User.id == vpn_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Получаем сервер
    server = db.query(Server).filter(Server.id == vpn_data.server_id).first()
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")

    # Генерируем IP - добавлена безопасная генерация
    assigned_ip = f"10.8.0.{vpn_data.user_id + 10}/32"
    
    # Проверяем, не существует ли уже пир с таким IP
    existing_peer = db.query(VPNPeer).filter(VPNPeer.allowed_ips == assigned_ip).first()
    if existing_peer:
        # Генерируем другой IP, если занят
        last_ip = db.query(VPNPeer).order_by(VPNPeer.id.desc()).first()
        if last_ip:
            last_number = int(last_ip.allowed_ips.split('.')[2])
            assigned_ip = f"10.8.0.{last_number + 1}/32"
        else:
            assigned_ip = f"10.8.0.{vpn_data.user_id + 100}/32"

    # Проверяем, не существует ли уже пир с таким публичным ключом
    existing_peer_by_key = db.query(VPNPeer).filter(VPNPeer.public_key == vpn_data.public_key).first()
    if existing_peer_by_key:
        raise HTTPException(status_code=400, detail="Peer with this public key already exists")

    # Вызываем Go-сервис
    try:
        await wg_client.add_peer(vpn_data.public_key, assigned_ip)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add peer to WireGuard: {str(e)}")

    # Генерируем .conf файл
    # ВАЖНО: клиент должен предоставить свой приватный ключ отдельно или генерировать его на клиенте
    # Здесь только шаблон конфига
    server_public_key = server.public_key
    server_endpoint = server.endpoint
    server_port = getattr(server, 'port', 51820)  # Порт по умолчанию

    config_content = f"""[Interface]
PrivateKey = {{CLIENT_PRIVATE_KEY_PLACEHOLDER}}  # Клиент должен подставить свой приватный ключ
Address = {assigned_ip}
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = {server_public_key}
AllowedIPs = 0.0.0.0/0
Endpoint = {server_endpoint}:{server_port}
PersistentKeepalive = 25
"""

    # Сохраняем в БД
    new_peer = VPNPeer(
        user_id=vpn_data.user_id,
        public_key=vpn_data.public_key,
        private_key_encrypted="ENCRYPTED_CLIENT_PRIVATE_KEY",  # Здесь должно быть зашифрованное значение
        config_content=config_content,
        allowed_ips=assigned_ip,
        server_id=vpn_data.server_id,
        is_active=True
    )
    
    try:
        db.add(new_peer)
        db.commit()
        db.refresh(new_peer)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return new_peer

@router.get("/config/{user_id}")
async def get_vpn_config(user_id: int, db: Session = Depends(get_db_session)):
    peer = db.query(VPNPeer).filter(VPNPeer.user_id == user_id).first()
    if not peer:
        raise HTTPException(status_code=404, detail="VPN configuration not found")
    if not peer.is_active:
        raise HTTPException(status_code=400, detail="VPN configuration is not active")

    # Возвращаем конфиг как текстовый файл
    return PlainTextResponse(
        content=peer.config_content,
        headers={
            "Content-Disposition": f"attachment; filename=vpn_config_{user_id}.conf",
            "Content-Type": "text/plain; charset=utf-8"
        }
    )

@router.delete("/config/{user_id}")
async def delete_vpn_config(user_id: int, db: Session = Depends(get_db_session)):
    """Удаление VPN конфигурации"""
    peer = db.query(VPNPeer).filter(VPNPeer.user_id == user_id).first()
    if not peer:
        raise HTTPException(status_code=404, detail="VPN configuration not found")
    
    try:
        # Удаляем пир из WireGuard
        await wg_client.remove_peer(peer.public_key)
    except Exception as e:
        # Логируем ошибку, но продолжаем удаление из БД
        print(f"Warning: Failed to remove peer from WireGuard: {str(e)}")
    
    # Удаляем из БД
    db.delete(peer)
    db.commit()
    
    return {"message": "VPN configuration deleted successfully"}