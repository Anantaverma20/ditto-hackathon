import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useConnectionEvents } from '@/hooks/useConnectionEvents';

interface ChaosMeterContextType {
  chaosLevel: number; // 0-100
  getChaosColor: () => string;
  getChaosLabel: () => string;
}

const ChaosMeterContext = createContext<ChaosMeterContextType | undefined>(undefined);

export const useChaosMeter = () => {
  const context = useContext(ChaosMeterContext);
  if (!context) {
    throw new Error('useChaosMeter must be used within ChaosMeterProvider');
  }
  return context;
};

interface ChaosMeterProviderProps {
  children: ReactNode;
}

export const ChaosMeterProvider = ({ children }: ChaosMeterProviderProps) => {
  const [chaosLevel, setChaosLevel] = useState(20); // Start with some base chaos

  // Listen for events that affect chaos level
  useConnectionEvents((event) => {
    if (event.type === 'event') {
      const action = event.action.toLowerCase();
      
      setChaosLevel(prev => {
        let change = 0;
        
        // Negative actions increase chaos
        if (['rage', 'angry', 'mad', 'furious', 'anger', 'cry', 'crying', 'sad', 'tear'].includes(action)) {
          change = 15;
        }
        // Mild negative actions
        else if (['left', 'frustrated', 'stressed', 'tired'].includes(action)) {
          change = 8;
        }
        // Positive actions decrease chaos
        else if (['party', 'celebrate', 'celebration', 'hooray', 'yay', 'dance', 'dancing'].includes(action)) {
          change = -12;
        }
        // Mild positive actions
        else if (['joined', 'happy', 'excited', 'productive'].includes(action)) {
          change = -5;
        }
        // Neutral actions slightly reduce chaos (stability)
        else if (['message', 'meeting', 'break', 'coffee'].includes(action)) {
          change = -2;
        }
        
        const newLevel = Math.max(0, Math.min(100, prev + change));
        return newLevel;
      });
    }
  });

  // Gradually decrease chaos over time (office naturally calms down)
  useEffect(() => {
    const interval = setInterval(() => {
      setChaosLevel(prev => Math.max(0, prev - 0.5));
    }, 30000); // Decrease by 0.5 every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Reset chaos level when office is reset
  useEffect(() => {
    const handleReset = () => {
      setChaosLevel(20);
    };

    window.addEventListener('office-reset', handleReset);
    return () => window.removeEventListener('office-reset', handleReset);
  }, []);

  const getChaosColor = () => {
    if (chaosLevel <= 25) return 'chaos-low';
    if (chaosLevel <= 50) return 'chaos-medium';
    if (chaosLevel <= 75) return 'chaos-high';
    return 'chaos-critical';
  };

  const getChaosLabel = () => {
    if (chaosLevel <= 25) return 'Zen';
    if (chaosLevel <= 50) return 'Busy';
    if (chaosLevel <= 75) return 'Hectic';
    return 'CHAOS!';
  };

  return (
    <ChaosMeterContext.Provider value={{
      chaosLevel,
      getChaosColor,
      getChaosLabel
    }}>
      {children}
    </ChaosMeterContext.Provider>
  );
};