'use strict';

require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { logger } = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

// ── HTTP Server ───────────────────────────────────────────
const server = http.createServer(app);

// ── Socket.IO (for SOS real-time alerts) ─────────────────
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach io to app so controllers can emit events
app.set('io', io);

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // Join admin room for receiving SOS alerts
  socket.on('join:admin', () => {
    socket.join('admin');
    logger.info(`Socket ${socket.id} joined admin room`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// ── Start Listening ───────────────────────────────────────
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  logger.info(`📡 Socket.IO ready for real-time SOS alerts`);
  logger.info(`🔗 Health: http://localhost:${PORT}/health`);
});

// ── Graceful Shutdown ─────────────────────────────────────
process.on('SIGTERM', () => {
  logger.info('SIGTERM received — shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});
