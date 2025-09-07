import { useEffect } from 'react';
import { connectionEvents, ConnectionMessage } from '@/contexts/ConnectionContext';

export const useConnectionEvents = (callback: (message: ConnectionMessage) => void) => {
  useEffect(() => {
    const unsubscribe = connectionEvents.subscribe(callback);
    return unsubscribe;
  }, [callback]);
};