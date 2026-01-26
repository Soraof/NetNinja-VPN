import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  server: {
    port: 3001,
    host: true,
    proxy: {
      // 🔥 ВСЕ /api запросы перенаправляем на локальный бекенд
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      // 🔥 Health check тоже
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    },
    allowedHosts: [
      'localhost',
      '.localhost',
      '.ngrok-free.dev',
      '127.0.0.1',
      '0.0.0.0'
    ]
  }
})