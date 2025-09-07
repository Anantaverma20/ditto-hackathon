import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';

export type ConnectionStatus = 'connecting' | 'live' | 'reconnecting' | 'offline';

export interface ConnectionMessage {
  type: string;
  data: any;
  timestamp: number;
}

interface ConnectionContextType {
  status: ConnectionStatus;
  lastMessage: ConnectionMessage | null;
  connect: () => void;
  disconnect: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within ConnectionProvider');
  }
  return context;
};

// Event emitter for connection messages
class ConnectionEventEmitter {
  private listeners: ((message: ConnectionMessage) => void)[] = [];

  subscribe(callback: (message: ConnectionMessage) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  emit(message: ConnectionMessage) {
    this.listeners.forEach(callback => callback(message));
  }
}

export const connectionEvents = new ConnectionEventEmitter();

interface ConnectionProviderProps {
  children: ReactNode;
}

export const ConnectionProvider = ({ children }: ConnectionProviderProps) => {
  const [status, setStatus] = useState<ConnectionStatus>('offline');
  const [lastMessage, setLastMessage] = useState<ConnectionMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connectionUrl = import.meta.env.VITE_CONNECTION_URL || '';
  const connectionType = import.meta.env.VITE_CONNECTION_TYPE || 'websocket'; // 'websocket' or 'sse'

  const cleanup = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const handleMessage = (data: any) => {
    const message: ConnectionMessage = {
      type: data.type || 'message',
      data: data.data || data,
      timestamp: Date.now()
    };
    setLastMessage(message);
    connectionEvents.emit(message);
  };

  const scheduleReconnect = () => {
    if (reconnectAttempts.current < maxReconnectAttempts) {
      setStatus('reconnecting');
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttempts.current++;
        connect();
      }, delay);
    } else {
      setStatus('offline');
    }
  };

  const connectWebSocket = () => {
    if (!connectionUrl) return;

    try {
      wsRef.current = new WebSocket(connectionUrl);
      
      wsRef.current.onopen = () => {
        setStatus('live');
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch {
          handleMessage({ data: event.data });
        }
      };

      wsRef.current.onclose = () => {
        setStatus('offline');
        wsRef.current = null;
        if (reconnectAttempts.current < maxReconnectAttempts) {
          scheduleReconnect();
        }
      };

      wsRef.current.onerror = () => {
        setStatus('offline');
      };
    } catch {
      setStatus('offline');
      scheduleReconnect();
    }
  };

  const connectSSE = () => {
    if (!connectionUrl) return;

    try {
      eventSourceRef.current = new EventSource(connectionUrl);
      
      eventSourceRef.current.onopen = () => {
        setStatus('live');
        reconnectAttempts.current = 0;
      };

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch {
          handleMessage({ data: event.data });
        }
      };

      eventSourceRef.current.onerror = () => {
        setStatus('offline');
        eventSourceRef.current = null;
        if (reconnectAttempts.current < maxReconnectAttempts) {
          scheduleReconnect();
        }
      };
    } catch {
      setStatus('offline');
      scheduleReconnect();
    }
  };

  const connect = () => {
    if (!connectionUrl) {
      setStatus('offline');
      return;
    }

    cleanup();
    setStatus('connecting');

    if (connectionType === 'sse') {
      connectSSE();
    } else {
      connectWebSocket();
    }
  };

  const disconnect = () => {
    cleanup();
    setStatus('offline');
    reconnectAttempts.current = 0;
  };

  useEffect(() => {
    if (connectionUrl) {
      connect();
    }

    return cleanup;
  }, [connectionUrl]);

  return (
    <ConnectionContext.Provider value={{ status, lastMessage, connect, disconnect }}>
      {children}
    </ConnectionContext.Provider>
  );
};