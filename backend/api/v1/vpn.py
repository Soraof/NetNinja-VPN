# backend/api/v1/vpn.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...schemas.vpn_peer import VPNPeerCreate, VPNPeerResponse
from ...core.database import get_db
from ...models.vpn_peer import VPNPeer
from ...wg_client import WGClient # Предполагаем, что у нас есть клиент
from ...core.confing import settings
import subprocess
import os

router = APIRouter(prefix="/vpn", tags=["VPN"])

wg_client = WGClient(settings.WG_ENDPOINT) # Инициализируем клиент

@router.post("/create", response_model=VPNPeerResponse)
async def create_vpn_config(vpn_data: VPNPeerCreate, db: Session = Depends(get_db)):
    # 1. Проверяем, что пользователь существует и имеет активную подписку
    # (логика проверки подписки опущена для краткости)
    # user = db.query(User).filter(User.id == vpn_data.user_id).first()
    # if not user or not user.subscription or not user.subscription.is_active:
    #     raise HTTPException(status_code=403, detail="No active subscription")

    # 2. Генерируем приватный и публичный ключи (если не предоставлены)
    # или используем предоставленный public_key
    client_public_key = vpn_data.public_key

    # 3. Генерируем уникальный IP для пира (упрощённо)
    # В реальности нужно использовать подсеть и отслеживать занятые IP
    assigned_ip = f"10.8.0.{vpn_data.user_id + 10}/32" # Пример

    # 4. Вызываем Go-сервис для добавления пира
    try:
        await wg_client.add_peer(client_public_key, assigned_ip)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add peer to WireGuard: {str(e)}")

    # 5. Генерируем .conf файл
    # Получаем информацию о сервере из БД
    server = db.query(Server).filter(Server.id == vpn_data.server_id).first()
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")

    # Считаем приватный ключ сервера из конфига или БД (предполагаем, что он есть)
    # В реальности его нужно безопасно хранить и доставать
    server_private_key = os.getenv("SERVER_PRIVATE_KEY") # Это НЕ безопасно, но для примера
    if not server_private_key:
        raise HTTPException(status_code=500, detail="Server private key not configured")

    config_content = f"""[Interface]
PrivateKey = CLIENT_PRIVATE_KEY_PLACEHOLDER # Клиент должен заменить на свой
Address = {assigned_ip}
DNS = 1.1.1.1

[Peer]
PublicKey = {server.public_key}
AllowedIPs = 0.0.0.0/0
Endpoint = {server.endpoint}
PersistentKeepalive = 25
"""

    # 6. Сохраняем информацию о пире в БД
    new_peer = VPNPeer(
        user_id=vpn_data.user_id,
        public_key=client_public_key,
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
async def get_vpn_config(user_id: int, db: Session = Depends(get_db)):
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


@router.put("/change_server/{user_id}")
async def change_vpn_server(user_id: int, new_server_id: int, db: Session = Depends(get_db)):
    """
    Сменить сервер для пользователя.
    """
    peer = db.query(VPNPeer).filter(VPNPeer.user_id == user_id).first()
    if not peer:
        raise HTTPException(status_code=404, detail="VPN configuration not found")

    old_server_id = peer.server_id
    peer.server_id = new_server_id
    # Тут нужно:
    # 1. Удалить старого пира с old_server
    # 2. Добавить нового пира на new_server
    # Это требует взаимодействия с Go-сервисом для удаления и создания.
    # Пока просто обновим запись в БД и вернем сообщение.
    # Реализация удаления/добавления через wg_client должна быть здесь.

    # await wg_client.remove_peer(peer.public_key) # Удалить старого пира
    # await wg_client.add_peer(peer.public_key, peer.allowed_ips, new_server_id) # Добавить на новый

    db.commit()
    # db.refresh(peer) # Не обязательно, если не возвращаем объект

    return {"message": f"Server changed from {old_server_id} to {new_server_id}. Reconnect required."}
