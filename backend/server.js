const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

// ✅ Set io globally for access in controllers
global._io = io;

// Socket.io logic
io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  socket.on('joinRoom', (userId) => {
    socket.join(userId); // ✅ Join the user's personal room
    console.log(`🔐 User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
