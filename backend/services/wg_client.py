# backend/services/wg_client.py
import httpx
from typing import Dict, Any, Optional

class WGClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.client = httpx.AsyncClient(timeout=10.0)

    async def add_peer(self, public_key: str, allowed_ips: str) -> Dict[str, Any]:
        url = f"{self.base_url}/api/peer"
        payload = {
            "public_key": public_key,
            "allowed_ips": allowed_ips
        }
        response = await self.client.post(url, json=payload)
        response.raise_for_status()
        return response.json()

    async def remove_peer(self, public_key: str) -> Dict[str, Any]:
        url = f"{self.base_url}/peer/{public_key}"
        response = await self.client.delete(url)
        response.raise_for_status()
        return response.json()

    async def get_peer_stats(self, public_key: str) -> Dict[str, Any]:
        url = f"{self.base_url}/peer/{public_key}/stats"
        response = await self.client.get(url)
        response.raise_for_status()
        return response.json()

    async def get_server_info(self) -> Dict[str, Any]:
        url = f"{self.base_url}/server/info"
        response = await self.client.get(url)
        response.raise_for_status()
        return response.json()

    async def close(self):
        await self.client.aclose()

# Глобальный экземпляр, можно инжектить через DI
# wg_client = WGClient(settings.WG_ENDPOINT)