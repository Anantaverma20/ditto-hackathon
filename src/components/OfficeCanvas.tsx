import { AnimatedAvatar } from './AnimatedAvatar';
import { mockUsers } from '@/data/mockData';
import { useAvatarRegistry } from '@/contexts/AvatarRegistry';
import { useConnection } from '@/contexts/ConnectionContext';

export function OfficeCanvas() {
  const { users, getTotalUsers } = useAvatarRegistry();
  const { status } = useConnection();
  
  // Use registry users if available, otherwise fall back to mock data
  const displayUsers = users.length > 0 ? users : mockUsers;
  const totalUsers = users.length > 0 ? getTotalUsers() : mockUsers.length;
  const isLive = users.length > 0 && status === 'live';

  return (
    <div className="flex-1 bg-gradient-canvas min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Office Chaos
          </h1>
          <p className="text-muted-foreground text-lg">
            {isLive ? 'Live office activity dashboard' : 'Office activity dashboard'} • {totalUsers} people {isLive ? 'active' : 'online'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 auto-rows-max">
          {displayUsers.map((user) => (
            <AnimatedAvatar
              key={user.id}
              userId={user.id}
              name={users.length > 0 ? user.displayName : user.name}
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
              Actions like "cry", "dance", "rage", "sleep", and "party" trigger special animations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}