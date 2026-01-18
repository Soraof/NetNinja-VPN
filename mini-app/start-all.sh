#!/bin/bash

# Цвета для красивого вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting NetNinja VPN Services...${NC}"

# Функция для запуска сервиса в фоне
start_service() {
    local dir=$1
    local cmd=$2
    local name=$3
    
    echo -e "${YELLOW}Starting $name...${NC}"
    
    (
        cd "$dir" && eval "$cmd"
    ) &
    
    # Сохраняем PID процесса
    PID=$!
    echo "$PID" > "/tmp/netninja_$name.pid"
    
    echo -e "${GREEN}$name started with PID $PID${NC}"
}

# Запускаем VPN Service (Go)
start_service "../vpn-service" "go run main.go" "vpn-service"

# Запускаем Backend (FastAPI) - в фоне
start_service "../backend" "PYTHONPATH=. python3 -m uvicorn main:app --host 0.0.0.0 --port 8000" "backend"

# Ждем немного, чтобы бэкенд запустился
sleep 3

# Запускаем Mini App (Vite) - в фоне
start_service "." "npm run dev -- --host --port 3000" "mini-app"

echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo -e "${GREEN}Services:${NC}"
echo -e "  Backend:    http://localhost:8000"
echo -e "  VPN Service: http://localhost:8080"
echo -e "  Mini App:   http://localhost:3000"
echo ""
echo -e "${YELLOW}To stop all services, run: ./stop-all.sh${NC}"