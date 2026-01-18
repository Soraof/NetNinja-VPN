// vite.config.js
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: resolve(__dirname),
  publicDir: 'public', // ← относительный путь!
  plugins: [preact()],
  server: {
    host: '127.0.0.1',
    port: 3001,
    open: true,
    strictPort: true
  },
  build: {
    outDir: 'dist'
  }
});