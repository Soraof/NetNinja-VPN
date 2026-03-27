# NetNinja VPN

> A gamified VPN service inside Telegram. Ninja style, WireGuard, Go + FastAPI.

**Status:** The MVP is ready. The core is working. The project is frozen after the active phase.

---

## 🧠 What is it

VPN with character leveling, missions, and referral. Everything is inside the Telegram Mini App.

---

## 📁 Structure

``
netninja-vpn/
├── bot/ # Telegram-bot (aiogram) — notifications
├── backend/           # FastAPI + PostgreSQL — basic logic
─── vpn-service/ # Go + wireguard — key management
,── mini-app/ # Preact + Tailwind interface
├── admin-panel/       # FastAPI + Jinja2 + HTMX — admin panel
,── infra/ # Docker, Ansible, scripts
└── docs/              # Documentation
```

---

## ⚙️ Technologies

| Component | Stack |
|-----------|------|
| Backend | Python / FastAPI / SQLAlchemy / PostgreSQL |
| VPN | Go / wireguard / wgctrl |
| Front | Preact / Tailwind / Telegram SDK |
| Bot | Python / aiogram |
| Infra | Docker / Docker Compose / Ansible |

---

## ✨ What's done

- **Go microservice** for WireGuard — 100% working core
- **Backend on FastAPI** — 95% ready, all endpoints
- **Mini App Structure** — 6 pages, gamification
- **Telegram Stars** — webhook for payments
- **Admin Panel** - User and server management
- **Referral + missions** — ready logic
- **Self—employment** - registration in progress

---

## 🚀 Launch

```bash
# Backend
cd backend
cp .env.example .env
python -m uvicorn main:app --reload

# Go-
cd vpn service
go run main.go

# Mini App
cd mini-app
npm install
npm run dev
```

Swagger: `http://127.0.0.1:8000/docs`

---

## 📅 Chronicle (January 2026)

> 9-10 / 30 images + gifs + bot structure — 4h  
> 10-11 / VPN core on Go — 100% ready — 1h 50m  
> 12-13 / backend 95% + self—employment - 2h  
> 16-17 / backend is fully operational — 3h  
> 17-21 / frontend Mini App — 20+hours  

**Total:** ~32 hours of active development in 12 days.
---

>The project was started using pieces of code from the Internet, and some parts of the code using AI

>The project has not been completed due to Lack of Time(

---

## 🔮 Next (until March 10th)

- [ ] Yukassa in production
- [ ] Assembling all parts into a single system
- [ ] Deploy to VPS
- [ ] Tests and docks

---

## 📄 License

MIT

