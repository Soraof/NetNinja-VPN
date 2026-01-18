// src/hooks/useTelegramAuth.js
import { useState, useEffect } from 'preact/hooks';

export const useTelegramAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      // Запущено в Telegram
      window.Telegram.WebApp.ready();
      const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
      if (tgUser) {
        setUser(tgUser);
        setIsAuthenticated(true);
      }
    } else {
      // 🧪 Mock-пользователь для разработки в браузере
      const mockUser = {
        id: 123456789,
        first_name: 'Dev Ninja',
        username: 'dev_ninja',
        language_code: 'en'
      };
      setUser(mockUser);
      setIsAuthenticated(true);
    }
  }, []);

  const openInvoice = (url) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openInvoice(url);
    }
  };

  return { user, isAuthenticated, openInvoice };
};