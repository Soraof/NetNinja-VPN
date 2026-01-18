import { useState, useEffect } from 'preact/hooks';

export const useTelegramAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Инициализация Telegram WebApp
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
            if (tgUser) {
                setUser(tgUser);
                setIsAuthenticated(true);
            }
        }
    }, []);

    const openInvoice = (url) => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openInvoice(url);
        }
    };

    return { user, isAuthenticated, openInvoice };
};