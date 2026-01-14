import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://student-managment-lovat.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

global._io = io;

io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`🔐 User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
