// test-server.mjs
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Отдаём статику
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: все остальные запросы → index.html
app.use((req, res, next) => {
  if (req.method === 'GET' && !path.extname(req.url)) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});

app.listen(3001, '127.0.0.1', () => {
  console.log('✅ NetNinja Mini-App running on http://127.0.0.1:3001');
});