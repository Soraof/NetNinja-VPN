from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings

# Импортируем роутеры
from api.v1.auth import router as auth_router
from api.v1.user import router as user_router
from api.v1.vpn import router as vpn_router
from api.v1.payments import router as payments_router
from api.v1.missions import router as missions_router
from api.v1.referrals import router as referrals_router

app = FastAPI(title="NetNinja VPN Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Регистрируем все роутеры
app.include_router(auth_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")
app.include_router(vpn_router, prefix="/api/v1")
app.include_router(payments_router, prefix="/api/v1")
app.include_router(missions_router, prefix="/api/v1")
app.include_router(referrals_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "NetNinja VPN Backend is running!", "status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)