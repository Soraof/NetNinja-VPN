from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Используем абсолютные импорты
from core.confing import settings

app = FastAPI(title="NetNinja VPN Backend, by Sora")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "NetNinja VPN Backend is running!", "status": "ok Sora)"}

@app.post("/api/v1/auth")
def authenticate_user():
    return {"status": "authenticated", "message": "Welcome, Sora)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)