import hashlib
import hmac
from urllib.parse import parse_qsl
from typing import Dict, Any, Optional

def validate_telegram_webapp_data(init_data: str, bot_token: str) -> bool:
    """
    Проверяем подпись initData от Telegram.
    https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
    """
    try:
        # 1. Парсим initData, игнорируя hash
        parsed_items = []
        for item in init_data.split("&"):
            if "=" in item:
                key, value = item.split("=", 1)
                parsed_items.append((key, value))

        # 2. Формируем строку данных для проверки подписи
        # Сортируем параметры по ключу
        sorted_items = sorted(parsed_items, key=lambda x: x[0])
        data_check_string = "\n".join([f"{key}={value}" for key, value in sorted_items])

        # 3. Создаем телеграм-секрет
        # secret_key = SHA256(BOT_TOKEN).digest()
        secret_key = hashlib.sha256(bot_token.encode()).digest()

        # 4. Создаем секрет для вычисления хэша (HMAC-SHA256)
        # telegram_secret = SHA256(secret_key).digest()
        telegram_secret = hashlib.sha256(secret_key).digest()

        # 5. Вычисляем HMAC-SHA256 подписи
        calculated_hash = hmac.new(telegram_secret, data_check_string.encode(), hashlib.sha256).hexdigest()

        # 6. Находим оригинальный хэш из initData
        original_hash = dict(parsed_items).get('hash')

        # 7. Сравниваем
        return calculated_hash == original_hash

    except Exception as e:
        print(f"Error validating Telegram WebApp data: {e}")
        return False

def parse_init_data(init_data: str) -> Optional[Dict[str, str]]:
    """
    Парсит initData и возвращает словарь параметров (без hash).
    """
    try:
        params = dict(parse_qsl(init_data))
        # Удаляем hash из параметров, он используется только для валидации
        params.pop('hash', None)
        return params
    except Exception as e:
        print(f"Error parsing Telegram WebApp data: {e}")
        return None