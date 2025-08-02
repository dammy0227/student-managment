import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'], // Force WebSocket transport
  withCredentials: true,
});

export default socket;
