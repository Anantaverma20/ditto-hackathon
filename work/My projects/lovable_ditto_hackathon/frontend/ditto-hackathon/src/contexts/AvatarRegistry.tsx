import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

export interface RegistryUser {
  id: string;
  displayName: string;
  initials: string;
  colorIndex: number;
  status: 'online' | 'away' | 'busy' | 'offline';
  gridPosition: number;
  lastActivity: number;
  room?: string;
}

interface AvatarRegistryContextType {
  users: RegistryUser[];
  addOrUpdateUser: (userId: string, displayName: string, room?: string) => RegistryUser;
  updateUserActivity: (userId: string) => void;
  getUserByPosition: (position: number) => RegistryUser | null;
  getTotalUsers: () => number;
}

const AvatarRegistryContext = createContext<AvatarRegistryContextType | undefined>(undefined);

export const useAvatarRegistry = () => {
  const context = useContext(AvatarRegistryContext);
  if (!context) {
    throw new Error('useAvatarRegistry must be used within AvatarRegistryProvider');
  }
  return context;
};

// Deterministic position generator based on userId
function generateGridPosition(userId: string): number {
  // Simple hash function to convert userId to a number
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Ensure positive number and map to grid positions (0-99 for a reasonable grid)
  return Math.abs(hash) % 100;
}

// Generate initials from display name
function generateInitials(displayName: string): string {
  return displayName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

// Generate color index from userId for consistency
function generateColorIndex(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 3) - hash) + userId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % 6; // 6 avatar colors available
}

interface AvatarRegistryProviderProps {
  children: ReactNode;
}

export const AvatarRegistryProvider = ({ children }: AvatarRegistryProviderProps) => {
  const [users, setUsers] = useState<RegistryUser[]>([]);
  const [occupiedPositions, setOccupiedPositions] = useState<Set<number>>(new Set());

  const findAvailablePosition = useCallback((preferredPosition: number): number => {
    // Try the preferred position first
    if (!occupiedPositions.has(preferredPosition)) {
      return preferredPosition;
    }

    // If preferred position is taken, find the nearest available position
    for (let offset = 1; offset < 100; offset++) {
      // Try positions spiraling out from the preferred position
      const pos1 = (preferredPosition + offset) % 100;
      const pos2 = (preferredPosition - offset + 100) % 100;
      
      if (!occupiedPositions.has(pos1)) return pos1;
      if (!occupiedPositions.has(pos2)) return pos2;
    }

    // Fallback to any available position
    for (let i = 0; i < 100; i++) {
      if (!occupiedPositions.has(i)) return i;
    }

    // If all positions taken, use preferred position anyway
    return preferredPosition;
  }, [occupiedPositions]);

  const addOrUpdateUser = useCallback((userId: string, displayName: string, room?: string): RegistryUser => {
    let resultUser: RegistryUser;
    
    setUsers(prevUsers => {
      const existingUser = prevUsers.find(user => user.id === userId);
      
      if (existingUser) {
        // Update existing user's activity and name if changed
        const updatedUser = {
          ...existingUser,
          displayName,
          initials: displayName !== existingUser.displayName ? generateInitials(displayName) : existingUser.initials,
          lastActivity: Date.now(),
          status: 'online' as const,
          room: room || existingUser.room
        };
        resultUser = updatedUser;
        
        return prevUsers.map(user =>
          user.id === userId ? updatedUser : user
        );
      } else {
        // Create new user
        const preferredPosition = generateGridPosition(userId);
        const gridPosition = findAvailablePosition(preferredPosition);
        
        const newUser: RegistryUser = {
          id: userId,
          displayName,
          initials: generateInitials(displayName),
          colorIndex: generateColorIndex(userId),
          status: 'online',
          gridPosition,
          lastActivity: Date.now(),
          room
        };

        resultUser = newUser;

        // Update occupied positions
        setOccupiedPositions(prev => new Set(prev).add(gridPosition));
        
        return [...prevUsers, newUser].sort((a, b) => a.gridPosition - b.gridPosition);
      }
    });

    return resultUser!;
  }, [findAvailablePosition]);

  const updateUserActivity = useCallback((userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, lastActivity: Date.now(), status: 'online' as const }
          : user
      )
    );
  }, []);

  const getUserByPosition = useCallback((position: number): RegistryUser | null => {
    return users.find(user => user.gridPosition === position) || null;
  }, [users]);

  const getTotalUsers = useCallback(() => users.length, [users]);

  // Listen for avatar registry updates from connection context
  useEffect(() => {
    const handleAvatarUpdate = (event: CustomEvent) => {
      const { userId, displayName, room } = event.detail;
      addOrUpdateUser(userId, displayName, room);
      updateUserActivity(userId);
    };

    const handleOfficeReset = () => {
      setUsers([]);
      setOccupiedPositions(new Set());
    };

    window.addEventListener('avatar-registry-update', handleAvatarUpdate as EventListener);
    window.addEventListener('office-reset', handleOfficeReset);
    
    return () => {
      window.removeEventListener('avatar-registry-update', handleAvatarUpdate as EventListener);
      window.removeEventListener('office-reset', handleOfficeReset);
    };
  }, [addOrUpdateUser, updateUserActivity]);

  // Auto-update user status based on activity (mark as away after 5 minutes of inactivity)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      setUsers(prevUsers =>
        prevUsers.map(user => ({
          ...user,
          status: now - user.lastActivity > fiveMinutes ? 'away' : user.status
        }))
      );
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AvatarRegistryContext.Provider value={{
      users,
      addOrUpdateUser,
      updateUserActivity,
      getUserByPosition,
      getTotalUsers
    }}>
      {children}
    </AvatarRegistryContext.Provider>
  );
};