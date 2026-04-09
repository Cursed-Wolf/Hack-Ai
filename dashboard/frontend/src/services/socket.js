// ============================================================
// PlaceIQ — Socket.IO Client Singleton
// Listens for real-time alerts from Event Engine
// ============================================================

import { io } from 'socket.io-client';
import useStore from '../store/useStore.js';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let socket = null;

export function initSocket() {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);
  });

  socket.on('alert', (alert) => {
    console.log('[Socket] Alert received:', alert);
    useStore.getState().addAlert(alert);
  });

  socket.on('new_high_match', (data) => {
    console.log('[Socket] New high match:', data);
    useStore.getState().addAlert({
      type: 'new_match',
      severity: 'info',
      message: `🎯 New high-match company found! Check your dashboard.`,
      ...data
    });
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Disconnected');
  });

  return socket;
}

export function subscribeStudent(studentId) {
  if (socket) {
    socket.emit('subscribe', studentId);
  }
}

export function getSocket() {
  return socket;
}
