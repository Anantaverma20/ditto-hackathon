import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OfficeSettingsContextType {
  muteMemes: boolean;
  reduceMotion: boolean;
  selectedRoom: string;
  availableRooms: string[];
  toggleMuteMemes: () => void;
  toggleReduceMotion: () => void;
  setSelectedRoom: (room: string) => void;
  addRoom: (room: string) => void;
  resetOffice: () => void;
}

const OfficeSettingsContext = createContext<OfficeSettingsContextType | undefined>(undefined);

export const useOfficeSettings = () => {
  const context = useContext(OfficeSettingsContext);
  if (!context) {
    throw new Error('useOfficeSettings must be used within OfficeSettingsProvider');
  }
  return context;
};

interface OfficeSettingsProviderProps {
  children: ReactNode;
}

export const OfficeSettingsProvider = ({ children }: OfficeSettingsProviderProps) => {
  const [muteMemes, setMuteMemes] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [selectedRoom, setSelectedRoomState] = useState('all');
  const [availableRooms, setAvailableRooms] = useState<string[]>(['all']);

  // Listen for room discovery events
  useEffect(() => {
    const handleRoomDiscovered = (event: CustomEvent) => {
      const { room } = event.detail;
      if (room && !availableRooms.includes(room)) {
        setAvailableRooms(prev => [...prev, room].sort());
      }
    };

    window.addEventListener('room-discovered', handleRoomDiscovered as EventListener);
    return () => window.removeEventListener('room-discovered', handleRoomDiscovered as EventListener);
  }, [availableRooms]);

  const toggleMuteMemes = () => {
    setMuteMemes(prev => !prev);
  };

  const toggleReduceMotion = () => {
    setReduceMotion(prev => !prev);
    // Apply reduce motion preference to document
    if (!reduceMotion) {
      document.documentElement.style.setProperty('--transition-smooth', 'none');
      document.documentElement.style.setProperty('--transition-bounce', 'none');
    } else {
      document.documentElement.style.removeProperty('--transition-smooth');
      document.documentElement.style.removeProperty('--transition-bounce');
    }
  };

  const setSelectedRoom = (room: string) => {
    setSelectedRoomState(room);
  };

  const addRoom = (room: string) => {
    if (room && !availableRooms.includes(room)) {
      setAvailableRooms(prev => [...prev, room].sort());
    }
  };

  const resetOffice = () => {
    // Emit reset event for other components to listen to
    window.dispatchEvent(new CustomEvent('office-reset'));
    
    // Reset local state
    setSelectedRoomState('all');
    setAvailableRooms(['all']);
  };

  return (
    <OfficeSettingsContext.Provider value={{
      muteMemes,
      reduceMotion,
      selectedRoom,
      availableRooms,
      toggleMuteMemes,
      toggleReduceMotion,
      setSelectedRoom,
      addRoom,
      resetOffice
    }}>
      {children}
    </OfficeSettingsContext.Provider>
  );
};