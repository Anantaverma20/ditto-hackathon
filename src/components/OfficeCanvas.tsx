import { AnimatedAvatar } from './AnimatedAvatar';
import { mockUsers } from '@/data/mockData';
import { useAvatarRegistry } from '@/contexts/AvatarRegistry';
import { useConnection } from '@/contexts/ConnectionContext';
import { useOfficeSettings } from '@/contexts/OfficeSettings';

export function OfficeCanvas() {
  const { users, getTotalUsers } = useAvatarRegistry();
  const { status } = useConnection();
  const { selectedRoom } = useOfficeSettings();
  
  // Use registry users if available, otherwise fall back to mock data
  const allUsers = users.length > 0 ? users : mockUsers;
  
  // Filter users by selected room (if room filtering is implemented)
  const displayUsers = selectedRoom === 'all' 
    ? allUsers 
    : allUsers.filter(user => {
        const userRoom = 'room' in user ? user.room : undefined;
        return userRoom === selectedRoom;
      });
    
  const totalUsers = displayUsers.length;
  const isLive = users.length > 0 && status === 'live';

  return (
    <div className="flex-1 bg-gradient-canvas p-8" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-muted-foreground text-lg">
            {isLive ? 'Live office activity dashboard' : 'Office activity dashboard'} • {totalUsers} people {isLive ? 'active' : 'online'}
            {selectedRoom !== 'all' && ` • Room: ${selectedRoom}`}
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 auto-rows-max">
          {displayUsers.map((user) => (
            <AnimatedAvatar
              key={user.id}
              userId={user.id}
              name={'displayName' in user ? user.displayName : user.name}
              initials={user.initials}
              colorIndex={user.colorIndex}
              status={user.status}
              className="justify-self-center"
            />
          ))}
        </div>
        
        {isLive && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Avatars are automatically positioned based on user ID for consistent placement
            </p>
            <p className="text-xs text-muted-foreground">
              Actions like "cry", "dance", "rage", "sleep", and "party" trigger special animations • Media URLs show floating overlays
            </p>
          </div>
        )}
      </div>
    </div>
  );
}