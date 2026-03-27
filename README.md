
Понял, бро! Делаю кратко, с # и с твоим любимым >. Чисто по делу.

---

# NetNinja VPN

> Геймифицированный VPN-сервис внутри Telegram. Ниндзя-стайл, WireGuard, Go + FastAPI.

**Статус:** MVP готов. Ядро работает. Проект в заморозке после активной фазы.

---

## 🧠 Что это

VPN с прокачкой персонажа, миссиями и рефералкой. Всё внутри Telegram Mini App.

---

## 📁 Структура

```
netninja-vpn/
├── bot/               # Telegram-бот (aiogram) — уведомления
├── backend/           # FastAPI + PostgreSQL — основная логика
├── vpn-service/       # Go + wireguard — управление ключами
├── mini-app/          # Preact + Tailwind — интерфейс
├── admin-panel/       # FastAPI + Jinja2 + HTMX — админка
├── infra/             # Docker, Ansible, скрипты
└── docs/              # Документация
```

---

## ⚙️ Технологии

| Компонент | Стек |
|-----------|------|
| Бекенд | Python / FastAPI / SQLAlchemy / PostgreSQL |
| VPN | Go / wireguard / wgctrl |
| Фронт | Preact / Tailwind / Telegram SDK |
| Бот | Python / aiogram |
| Инфра | Docker / Docker Compose / Ansible |

---

## ✨ Что сделано

- **Go-микросервис** для WireGuard — 100% рабочее ядро
- **Бекенд на FastAPI** — 95% готов, все эндпоинты
- **Структура Mini App** — 6 страниц, геймификация
- **Telegram Stars** — webhook для платежей
- **Админ-панель** — управление пользователями и серверами
- **Рефералка + миссии** — готовая логика
- **Самозанятость** — оформление в процессе

---

## 🚀 Запуск

```bash
# Бекенд
cd backend
cp .env.example .env
python -m uvicorn main:app --reload

# Go-сервис
cd vpn-service
go run main.go

# Mini App
cd mini-app
npm install
npm run dev
```

Swagger: `http://127.0.0.1:8000/docs`

---

## 📅 Хроника (январь 2026)

> 9-10 / 30 картинок + гифки + структура бота — 4ч  
> 10-11 / ядро VPN на Go — 100% готово — 1ч 50м  
> 12-13 / бекенд 95% + самозанятость — 2ч  
> 16-17 / бекенд полностью рабочий — 3ч  
> 17-21 / фронтенд Mini App — 20+ч  

**Итого:** ~32 часа активной разработки за 12 дней.

---

## 🔮 Дальше (до 10 марта)

- [ ] ЮKassa в продакшен
- [ ] Сборка всех частей в единую систему
- [ ] Деплой на VPS
- [ ] Тесты и доки

---

## 📄 Лицензия

MIT
