// ============================================================
// PlaceIQ — Server Entry Point
// Express + Socket.IO initialization
// ============================================================

import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import apiRoutes from './api/routes/index.js';
import { initEventEngine, evaluateAlerts } from './services/eventEngine.js';

const app = express();
const httpServer = createServer(app);

// Socket.IO with CORS for frontend
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://hack-ai-9efc4.web.app', 'https://hack-ai-9efc4.firebaseapp.com'],
    methods: ['GET', 'POST']
  }
});

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://hack-ai-9efc4.web.app', 'https://hack-ai-9efc4.firebaseapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// ─── API Routes ─────────────────────────────────────────────
app.use('/api', apiRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PlaceIQ Backend',
    geminiKey: process.env.GEMINI_API_KEY ? 'set' : 'using fallback',
    timestamp: new Date().toISOString()
  });
});

app.get('/debug', (req, res) => {
  import('fs').then(fs => {
    const contents = fs.readFileSync('./src/services/gemini.service.js', 'utf8');
    const hasFlashLite = contents.includes('gemini-2.5-flash-lite');
    const has20Flash = contents.includes('gemini-2.0-flash');
    res.json({
      hasFlashLite,
      has20Flash,
      isDeployed: true
    });
  }).catch(err => {
    res.json({ error: err.message });
  });
});

// ─── Socket.IO ──────────────────────────────────────────────
initEventEngine(io);

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Send initial alerts on connection
  socket.on('subscribe', (studentId) => {
    const alerts = evaluateAlerts(studentId);
    alerts.forEach(alert => socket.emit('alert', alert));
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// ─── Start Server ───────────────────────────────────────────
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   PlaceIQ Backend — Running on :${PORT}     ║
  ║   REST API:  http://localhost:${PORT}/api   ║
  ║   Health:    http://localhost:${PORT}/health ║
  ║   WebSocket: ws://localhost:${PORT}         ║
  ╚══════════════════════════════════════════╝
  `);
});

export { app, io };
