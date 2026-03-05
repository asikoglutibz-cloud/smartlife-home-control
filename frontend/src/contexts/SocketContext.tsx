import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import type { Device, Scene, SecurityData } from '@/types';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token && !socketRef.current) {
      socketRef.current = io(API_URL, {
        transports: ['websocket', 'polling'],
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current?.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socketRef.current.on('deviceUpdated', (device: Device) => {
        console.log('Device updated:', device);
        // Trigger a custom event for components to listen to
        window.dispatchEvent(new CustomEvent('deviceUpdated', { detail: device }));
      });

      socketRef.current.on('sceneActivated', (scene: Scene) => {
        console.log('Scene activated:', scene);
        window.dispatchEvent(new CustomEvent('sceneActivated', { detail: scene }));
      });

      socketRef.current.on('securityUpdated', (data: SecurityData) => {
        console.log('Security updated:', data);
        window.dispatchEvent(new CustomEvent('securityUpdated', { detail: data }));
      });

      socketRef.current.on('energyUpdate', (data: { currentUsage: number }) => {
        window.dispatchEvent(new CustomEvent('energyUpdate', { detail: data }));
      });

      socketRef.current.on('sensorTriggered', (data: { deviceId: number; timestamp: Date }) => {
        window.dispatchEvent(new CustomEvent('sensorTriggered', { detail: data }));
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
