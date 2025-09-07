import { Avatar } from './Avatar';
import { mockUsers } from '@/data/mockData';

export function OfficeCanvas() {
  return (
    <div className="flex-1 bg-gradient-canvas min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Office Chaos
          </h1>
          <p className="text-muted-foreground text-lg">
            Live office activity dashboard • {mockUsers.length} people online
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 auto-rows-max">
          {mockUsers.map((user) => (
            <Avatar
              key={user.id}
              name={user.name}
              initials={user.initials}
              colorIndex={user.colorIndex}
              status={user.status}
              className="justify-self-center"
            />
          ))}
        </div>
      </div>
    </div>
  );
}