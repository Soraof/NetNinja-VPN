import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    host: '0.0.0.0',  // ← Разрешить подключения с любых IP
    port: 3001,       // ← Измени на 3001
    cors: true,
    strictPort: false, // ← Не паниковать, если порт занят
    open: false,      // ← Не открывать браузер автоматически
  },
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: true
  }
});