
---

# NetNinja VPN

<img width="1200" height="675" alt="image" src="https://github.com/user-attachments/assets/4b63b565-fa10-40a5-9cb8-78ffbd99a928" />


> A gamified VPN service inside Telegram. Ninja style, WireGuard, Go + FastAPI.

**Status:** MVP is ready. Core is working. Project is on hold after the active phase.

---

## 🧠 What is it

VPN with character leveling, missions, and referral system. Everything inside Telegram Mini App.

---

## 📁 Structure

```
netninja-vpn/
├── bot/               # Telegram bot (aiogram) — notifications
├── backend/           # FastAPI + PostgreSQL — core logic
├── vpn-service/       # Go + wireguard — key management
├── mini-app/          # Preact + Tailwind — UI
├── admin-panel/       # FastAPI + Jinja2 + HTMX — admin panel
├── infra/             # Docker, Ansible, scripts
└── docs/              # Documentation
```

---

## ⚙️ Tech Stack

| Component | Stack |
|-----------|-------|
| Backend | Python / FastAPI / SQLAlchemy / PostgreSQL |
| VPN | Go / wireguard / wgctrl |
| Frontend | Preact / Tailwind / Telegram SDK |
| Bot | Python / aiogram |
| Infra | Docker / Docker Compose / Ansible |

---

## ✨ What's Done

- **Go microservice** for WireGuard — 100% working core
- **FastAPI backend** — 95% ready, all endpoints
- **Mini App structure** — 6 pages, gamification
- **Telegram Stars** — webhook for payments
- **Self-employment** — registration in progress

---

## 🚀 Run Locally

```bash
# Backend
cd backend
cp .env.example .env
python -m uvicorn main:app --reload

# Go service
cd vpn-service
go run main.go

# Mini App
cd mini-app
npm install
npm run dev
```

Swagger: `http://127.0.0.1:8000/docs`

---

## 📅 Timeline (January 2026)

> 9-10 / 30 images + gifs + bot structure — 4h  
> 10-11 / VPN core on Go — 100% ready — 1h 50m  
> 12-13 / backend 95% + self-employment — 2h  
> 16-17 / backend fully working — 3h  
> 17-21 / Mini App frontend — 20+ h  

**Total:** ~32 hours of active development in 12 days.

> The project was started using pieces of code from the internet, and some parts using AI.  
> The project was not completed due to lack of time.

---

## 🔮 Next Steps (until March 10)

- [ ] YooKassa in production
- [ ] Assemble all parts into one system
- [ ] Deploy to VPS
- [ ] Tests & docs

---

## 📄 License

MIT

---


