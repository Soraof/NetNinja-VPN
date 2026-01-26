# backend/services/telegram_notifier.py

import requests
from core.config import settings
from typing import Optional

def send_notification(chat_id: str, message: str, parse_mode: str = "HTML") -> bool:
    """
    Отправляет уведомление пользователю через Telegram Bot API
    
    Args:
        chat_id (str): ID чата пользователя
        message (str): Текст сообщения
        parse_mode (str): Форматирование (HTML или Markdown)
    
    Returns:
        bool: Успешно ли отправлено
    """
    try:
        url = f"https://api.telegram.org/bot{settings.TG_BOT_TOKEN}/sendMessage"
        
        payload = {
            'chat_id': chat_id,
            'text': message,
            'parse_mode': parse_mode,
            'disable_web_page_preview': True
        }
        
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            return True
        else:
            print(f"Telegram notification failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"Error sending Telegram notification: {e}")
        return False


def send_vpn_status_update(chat_id: str, is_connected: bool, server_name: str = None) -> bool:
    """
    Отправляет обновление статуса VPN
    """
    if is_connected:
        message = f"✅ VPN подключен к серверу <b>{server_name or 'неизвестному'}</b>"
    else:
        message = "❌ VPN отключен"
    
    return send_notification(chat_id, message)


def send_mission_completed(chat_id: str, mission_title: str, reward_amount: int, reward_type: str) -> bool:
    """
    Отправляет уведомление о выполнении миссии
    """
    message = f"🎉 Миссия <b>{mission_title}</b> выполнена!\n\n" \
              f"Получено: <b>{reward_amount} {reward_type.upper()}</b>"
    
    return send_notification(chat_id, message)

# Пример использования в tasks/notify_expiring.py:
# from services.telegram_notifier import send_notification