from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings

# Создаём приложение
app = FastAPI(title="NetNinja VPN Backend")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене ограничь!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Простой маршрут для проверки
@app.get("/")
def read_root():
    return {"message": "NetNinja VPN Backend is running!", "status": "ok"}

# Простой маршрут аутентификации (заглушка)
@app.post("/api/v1/auth")
def authenticate_user():
    return {"status": "authenticated", "message": "Welcome, ninja!"}

# Запуск uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)