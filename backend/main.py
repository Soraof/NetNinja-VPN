from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Добавляем текущую директорию в путь Python
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(
    title="NetNinja VPN Backend",
    description="Backend API для NetNinja VPN сервиса",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc
    openapi_url="/openapi.json"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене укажи конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Регистрируем роутеры с чёткими префиксами

# 1. Auth router
try:
    from api.v1.auth import router as auth_router
    app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
    print("✓ Auth router registered at /api/v1/auth")
except ImportError as e:
    print(f"✗ Auth router error: {e}")

# 2. User router
try:
    from api.v1.user import router as user_router
    app.include_router(user_router, prefix="/api/v1/user", tags=["Users"])
    print("✓ User router registered at /api/v1/user")
except ImportError as e:
    print(f"✗ User router error: {e}")

# 3. VPN router
try:
    from api.v1.vpn import router as vpn_router
    app.include_router(vpn_router, prefix="/api/v1/vpn", tags=["VPN"])
    print("✓ VPN router registered at /api/v1/vpn")
except ImportError as e:
    print(f"✗ VPN router error: {e}")

# 4. Payments router
try:
    from api.v1.payments import router as payments_router
    app.include_router(payments_router, prefix="/api/v1/payments", tags=["Payments"])
    print("✓ Payments router registered at /api/v1/payments")
except ImportError as e:
    print(f"✗ Payments router error: {e}")

# 5. Missions router
try:
    from api.v1.missions import router as missions_router
    app.include_router(missions_router, prefix="/api/v1/missions", tags=["Missions"])
    print("✓ Missions router registered at /api/v1/missions")
except ImportError as e:
    print(f"✗ Missions router error: {e}")

# 6. Referrals router
try:
    from api.v1.referrals import router as referrals_router
    app.include_router(referrals_router, prefix="/api/v1/referrals", tags=["Referrals"])
    print("✓ Referrals router registered at /api/v1/referrals")
except ImportError as e:
    print(f"✗ Referrals router error: {e}")

# 7. Health check router (простой)
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "NetNinja VPN Backend",
        "version": "1.0.0"
    }

# 8. Root endpoint
@app.get("/")
async def root():
    return {
        "message": "NetNinja VPN Backend API",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0"
    }

# 9. API info
@app.get("/api")
async def api_info():
    return {
        "api_version": "v1",
        "endpoints": {
            "auth": "/api/v1/auth",
            "users": "/api/v1/user", 
            "vpn": "/api/v1/vpn",
            "payments": "/api/v1/payments",
            "missions": "/api/v1/missions",
            "referrals": "/api/v1/referrals"
        }
    }

# 10. 404 handler
@app.exception_handler(404)
async def not_found_exception_handler(request, exc):
    return {
        "error": "Not Found",
        "message": f"Route {request.url.path} does not exist",
        "available_routes": [
            "/",
            "/api",
            "/health",
            "/docs",
            "/api/v1/auth",
            "/api/v1/user",
            "/api/v1/vpn",
            "/api/v1/payments", 
            "/api/v1/missions",
            "/api/v1/referrals"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )