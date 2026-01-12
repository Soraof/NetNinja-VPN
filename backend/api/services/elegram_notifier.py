# backend/services/telegram_notifier.py
import httpx
from typing import Dict, Any, Optional

class TelegramNotifier:
    def __init__(self, bot_token: str):
        self.bot_token = bot_token
        self.base_url = f"https://api.telegram.org/bot{bot_token}"

    async def send_message(self, chat_id: str, text: str, parse_mode: Optional[str] = None) -> Dict[str, Any]:
        url = f"{self.base_url}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": parse_mode
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            return response.json()

    # Пример метода для уведомления о заканчивающейся подписке
    async def notify_subscription_expiring(self, telegram_id: str, days_left: int):
        message = f"🥷 Ваша подписка заканчивается через {days_left} дней. Продлите защиту!"
        try:
            await self.send_message(telegram_id, message)
        except Exception as e:
            print(f"Failed to send notification to {telegram_id}: {e}")

# Глобальный экземпляр
# notifier = TelegramNotifier(settings.TG_BOT_TOKEN)