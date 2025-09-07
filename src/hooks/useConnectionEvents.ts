import { useEffect } from 'react';
import { validatedEvents } from '@/contexts/ConnectionContext';
import { Event } from '@/data/mockData';

export const useConnectionEvents = (callback: (event: Event) => void) => {
  useEffect(() => {
    const unsubscribe = validatedEvents.subscribe(callback);
    return unsubscribe;
  }, [callback]);
};