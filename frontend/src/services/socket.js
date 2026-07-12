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

// Convenience subscribers. Return an `off()` unsubscribe.
function subscribe(event, handler) {
  const s = getSocket();
  s.on(event, handler);
  return () => s.off(event, handler);
}

export const onSosNew = (fn) => subscribe('sos:new', fn);
export const onSosResolved = (fn) => subscribe('sos:resolved', fn);
export const onSosClaimed = (fn) => subscribe('sos:claimed', fn);
export const onNotification = (fn) => subscribe('notification', fn);
