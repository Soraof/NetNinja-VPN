# backend/tasks/update_traffic.py
from celery import Celery
from core.config import settings
from sqlalchemy.orm import Session
from core.database import get_db
from models.vpn_peer import VPNPeer
from services.wg_client import WireGuardClient
from datetime import datetime

celery = Celery(__name__)
celery.conf.broker_url = settings.CELERY_BROKER_URL

@celery.task
def update_vpn_traffic():
    """Обновляет статистику трафика для всех активных пиров"""
    db: Session = next(get_db())
    try:
        # Получить всех активных VPN пиров
        active_peers = db.query(VPNPeer).filter(
            VPNPeer.is_active == True
        ).all()
        
        wg_client = WireGuardClient()
        
        for peer in active_peers:
            try:
                # Получить статистику от WireGuard
                peer_stats = wg_client.get_peer_stats(peer.public_key)
                
                if peer_stats:
                    peer.bytes_received = peer_stats.get('bytes_received', 0)
                    peer.bytes_sent = peer_stats.get('bytes_sent', 0)
                    peer.last_handshake_at = peer_stats.get('last_handshake_at')
                    peer.traffic_updated_at = datetime.utcnow()
                    
            except Exception as e:
                print(f"Error updating traffic for peer {peer.id}: {e}")
        
        db.commit()
        print(f"Updated traffic for {len(active_peers)} peers")
    except Exception as e:
        print(f"Error in update_vpn_traffic: {e}")
        db.rollback()
    finally:
        db.close()