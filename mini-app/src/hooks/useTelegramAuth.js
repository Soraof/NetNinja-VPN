// src/hooks/useTelegramAuth.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { useState, useEffect } from 'preact/hooks';
import { apiService } from '../services/api';

export const useTelegramAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            console.log('🔐 TELEGRAM AUTH INITIALIZATION STARTED');
            
            try {
                // Проверяем, находимся ли мы в Telegram Web App
                const isInTelegram = typeof window !== 'undefined' && 
                                    window.Telegram?.WebApp?.initDataUnsafe?.user;

                if (isInTelegram) {
                    console.log('📱 DETECTED TELEGRAM WEB APP');
                    
                    // Инициализируем Telegram WebApp
                    const tg = window.Telegram.WebApp;
                    tg.ready();
                    tg.expand(); // Раскрываем на весь экран
                    
                    // Получаем пользователя из Telegram
                    const tgUser = tg.initDataUnsafe.user;
                    console.log('✅ TELEGRAM USER DATA:', tgUser);
                    
                    // Сохраняем пользователя в state
                    setUser(tgUser);
                    
                    // Устанавливаем telegramId в apiService
                    apiService.telegramId = tgUser.id;
                    
                    // Пробуем аутентифицироваться на бекенде
                    const initData = tg.initData;
                    if (initData) {
                        console.log('🔄 ATTEMPTING BACKEND AUTHENTICATION...');
                        
                        try {
                            // Вызываем метод authenticate из apiService
                            const authResult = await apiService.authenticate(initData);
                            console.log('🎯 AUTH RESULT:', authResult);
                            
                            if (authResult.user_id || authResult.access_token) {
                                console.log('✅ BACKEND AUTH SUCCESSFUL');
                                setIsAuthenticated(true);
                                setAuthError(null);
                            } else {
                                console.log('⚠️ BACKEND AUTH RETURNED NO TOKENS');
                                // Но всё равно считаем авторизованным через Telegram
                                setIsAuthenticated(true);
                            }
                        } catch (authError) {
                            console.error('❌ BACKEND AUTH FAILED:', authError);
                            // Даже если бекенд не ответил, считаем авторизованным через Telegram
                            setIsAuthenticated(true);
                            setAuthError(authError.message);
                        }
                    } else {
                        console.log('⚠️ NO INITDATA, USING TELEGRAM AUTH ONLY');
                        setIsAuthenticated(true);
                    }
                    
                } else if (import.meta.env.DEV) {
                    // РЕЖИМ РАЗРАБОТКИ - мок данные
                    console.log('💻 DEVELOPMENT MODE - USING MOCK DATA');
                    
                    const mockUser = {
                        id: 5235383955, // Твой реальный ID
                        first_name: 'Ninja',
                        username: 'ninja_dev',
                        language_code: 'en'
                    };
                    
                    setUser(mockUser);
                    apiService.telegramId = mockUser.id;
                    
                    // Для разработки - проверяем доступность API
                    try {
                        const isApiAlive = await apiService.testConnection();
                        console.log('🌐 API CONNECTION:', isApiAlive ? '✅ ALIVE' : '❌ DEAD');
                        
                        if (isApiAlive) {
                            // Пробуем аутентифицироваться с фейковыми данными
                            await apiService.authenticate('dev_mode_' + Date.now());
                        }
                    } catch (error) {
                        console.log('⚠️ API NOT AVAILABLE, USING OFFLINE MODE');
                    }
                    
                    setIsAuthenticated(true);
                    
                } else {
                    // Не в Telegram и не в режиме разработки
                    console.log('❌ NOT IN TELEGRAM AND NOT IN DEV MODE');
                    setIsAuthenticated(false);
                    setAuthError('Open this app through Telegram bot');
                }
                
            } catch (error) {
                console.error('🔥 AUTH INITIALIZATION ERROR:', error);
                setAuthError(error.message);
                
                // В режиме разработки всё равно разрешаем доступ
                if (import.meta.env.DEV) {
                    setIsAuthenticated(true);
                }
            } finally {
                console.log('🏁 AUTH INITIALIZATION COMPLETE', {
                    user: user?.id,
                    authenticated: isAuthenticated,
                    error: authError
                });
                
                setIsLoading(false);
            }
        };

        // Запускаем с небольшой задержкой
        const timer = setTimeout(initializeAuth, 300);
        
        // Очистка таймера при размонтировании
        return () => clearTimeout(timer);
    }, []);

    const openInvoice = (url) => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openInvoice(url);
        } else {
            // Для разработки - открываем в новой вкладке
            window.open(url, '_blank');
        }
    };

    const logout = () => {
        apiService.clearTokens();
        setUser(null);
        setIsAuthenticated(false);
        window.location.reload();
    };

    return { 
        user, 
        isAuthenticated, 
        isLoading, 
        authError,
        openInvoice,
        logout,
        // Геттер для telegramId
        getTelegramId: () => apiService.telegramId
    };
};