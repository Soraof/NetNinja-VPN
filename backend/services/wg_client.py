# backend/services/wg_client.py
import httpx  # Замени requests на httpx для async
from typing import Dict, Any

class WGClient:
    def __init__(self, endpoint: str):
        self.endpoint = endpoint.rstrip('/')

    async def add_peer(self, public_key: str, allowed_ips: str) -> Dict[Any, Any]:
        """Добавить пира через Go VPN сервис"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.endpoint}/api/peer"
                payload = {
                    "public_key": public_key,
                    "allowed_ips": allowed_ips
                }
                
                response = await client.post(url, json=payload)
                
                if response.status_code == 200:
                    return response.json()
                else:
                    raise Exception(f"Failed to add peer: {response.text}")
                    
        except Exception as e:
            print(f"Error adding peer: {e}")
            raise

    async def remove_peer(self, public_key: str) -> bool:
        """Удалить пира через Go VPN сервис"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.endpoint}/api/peer/{public_key}"
                response = await client.delete(url)
                return response.status_code == 200
        except Exception as e:
            print(f"Error removing peer: {e}")
            return False

    async def get_peer_stats(self, public_key: str) -> Dict[Any, Any]:
        """Получить статистику пира"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.endpoint}/api/peer/{public_key}/stats"
                response = await client.get(url)
                
                if response.status_code == 200:
                    return response.json()
                else:
                    return {}
        except Exception as e:
            print(f"Error getting peer stats: {e}")
            return {}

    async def get_server_info(self) -> Dict[Any, Any]:
        """Получить информацию о сервере"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.endpoint}/api/server/info"
                response = await client.get(url)
                
                if response.status_code == 200:
                    return response.json()
                else:
                    return {}
        except Exception as e:
            print(f"Error getting server info: {e}")
            return {}