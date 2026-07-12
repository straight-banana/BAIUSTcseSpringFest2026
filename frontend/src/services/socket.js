import { io } from 'socket.io-client';

const WS_URL =
  import.meta.env.VITE_WS_URL ||
  (import.meta.env.VITE_API_URL || '').replace(/\/api\/v1\/?$/, '') ||
  'http://localhost:5000';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(WS_URL, { autoConnect: true, transports: ['websocket', 'polling'] });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinAdminRoom() {
  getSocket().emit('join:admin');
}
