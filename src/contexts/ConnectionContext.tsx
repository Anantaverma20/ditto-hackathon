import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { Event } from '@/data/mockData';
import { validateEventPayload, createValidEvent, createErrorEvent } from '@/utils/eventValidation';

export type ConnectionStatus = 'connecting' | 'live' | 'reconnecting' | 'offline';

export interface ConnectionMessage {
  type: string;
  data: any;
  timestamp: number;
}

interface ConnectionContextType {
  status: ConnectionStatus;
  lastMessage: ConnectionMessage | null;
  events: Event[];
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

// Event emitter for validated events
class EventEmitter {
  private listeners: ((event: Event) => void)[] = [];

  subscribe(callback: (event: Event) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  emit(event: Event) {
    this.listeners.forEach(callback => callback(event));
  }
}

export const validatedEvents = new EventEmitter();

interface ConnectionProviderProps {
  children: ReactNode;
  avatarRegistry?: {
    addOrUpdateUser: (userId: string, displayName: string) => void;
    updateUserActivity: (userId: string) => void;
  };
}

export const ConnectionProvider = ({ children }: ConnectionProviderProps) => {
  const [status, setStatus] = useState<ConnectionStatus>('offline');
  const [lastMessage, setLastMessage] = useState<ConnectionMessage | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
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

    // Validate and process event payload
    const validation = validateEventPayload(data);
    let processedEvent: Event;
    
    if (validation.isValid && validation.validatedPayload) {
      processedEvent = createValidEvent(validation.validatedPayload);
      
      // Notify avatar registry via window event (decoupled approach)
      window.dispatchEvent(new CustomEvent('avatar-registry-update', {
        detail: {
          userId: validation.validatedPayload.userId,
          displayName: validation.validatedPayload.displayName
        }
      }));
    } else {
      processedEvent = createErrorEvent(validation.errors, data);
    }

    // Add event to the list (keep last 50 events)
    setEvents(prevEvents => [processedEvent, ...prevEvents.slice(0, 49)]);
    
    // Emit the processed event
    validatedEvents.emit(processedEvent);
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
    <ConnectionContext.Provider value={{ status, lastMessage, events, connect, disconnect }}>
      {children}
    </ConnectionContext.Provider>
  );
};
