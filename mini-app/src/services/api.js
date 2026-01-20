const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // ====== АУТЕНТИФИКАЦИЯ ======
    
    async authenticate(initData) {
        return this.request('/auth/auth/', {
            method: 'POST',
            body: JSON.stringify({ initData })
        });
    }

    // ====== ПОЛЬЗОВАТЕЛЬ ======
    
    async getUserProfile(telegramId) {
        return this.request(`/user/profile/${telegramId}`);
    }

    async updateUserProfile(telegramId, data) {
        return this.request(`/user/profile/${telegramId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async getUserLevel(telegramId) {
        return this.request(`/user/level/${telegramId}`);
    }

    async getUserStats(telegramId) {
        return this.request(`/user/stats/${telegramId}`);
    }

    // ====== VPN ======
    
    async createVPNConnection(data) {
        return this.request('/vpn/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getVPNConfig(userId) {
        return this.request(`/vpn/config/${userId}`);
    }

    // ====== ПЛАТЕЖИ ======
    
    async processPaymentWebhook(data) {
        return this.request('/payments/webhook', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // ====== МИССИИ ======
    
    async getDailyMissions(telegramId) {
        return this.request(`/missions/daily/${telegramId}`);
    }

    async completeMission(missionId) {
        return this.request(`/missions/complete/${missionId}`, {
            method: 'POST'
        });
    }

    // ====== РЕФЕРАЛЫ ======
    
    async getReferralLink(telegramId) {
        return this.request(`/referrals/${telegramId}`);
    }

    async registerReferral(data) {
        return this.request('/referrals/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // ====== УТИЛИТЫ ======
    
    // Методы, которых НЕТ в бекенде (возвращаем моки или бросаем ошибку)
    async getCurrentUser() {
        throw new Error('Метод getCurrentUser не реализован в бекенде. Используйте getUserProfile(telegramId)');
    }

    async getVpnStatus() {
        return {
            connected: false,
            server: null,
            connected_since: null,
            traffic_today_mb: 0
        };
    }

    async disconnectVpn() {
        return { success: true, message: 'Mock disconnect' };
    }

    async getAvailableServers() {
        return [
            {
                id: 1,
                name: 'Tokyo Shadows',
                country: 'JP',
                flag: '🇯🇵',
                load: 35,
                latency: 45,
                premium: false
            }
        ];
    }

    async getBalance() {
        return { stars: 2850, ryo: 5000 };
    }
}

export const apiService = new ApiService();