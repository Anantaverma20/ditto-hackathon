import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  initials: string;
  colorIndex: number;
  status?: 'online' | 'away' | 'busy' | 'offline';
  className?: string;
}

const getAvatarColor = (index: number) => {
  const colors = [
    'bg-avatar-1',
    'bg-avatar-2', 
    'bg-avatar-3',
    'bg-avatar-4',
    'bg-avatar-5',
    'bg-avatar-6',
  ];
  return colors[index % colors.length];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-event-positive';
    case 'away': return 'bg-accent';
    case 'busy': return 'bg-destructive';
    default: return 'bg-muted-foreground';
  }
};

export function Avatar({ name, initials, colorIndex, status = 'offline', className }: AvatarProps) {
  return (
    <div className={cn("flex flex-col items-center group cursor-pointer", className)}>
      <div className="relative">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-lg",
          "shadow-avatar transition-all duration-300 group-hover:scale-105",
          "group-hover:shadow-lg",
          getAvatarColor(colorIndex)
        )}>
          {initials}
        </div>
        
        {/* Status indicator */}
        <div className={cn(
          "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background",
          getStatusColor(status)
        )} />
      </div>
      
      <span className="mt-2 text-sm font-medium text-foreground text-center max-w-20 truncate group-hover:text-primary transition-colors">
        {name}
      </span>
    </div>
  );
}