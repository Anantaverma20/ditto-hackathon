import { useConnection, ConnectionStatus as Status } from '@/contexts/ConnectionContext';
import { cn } from '@/lib/utils';

const statusConfig = {
  connecting: {
    label: 'Connecting',
    color: 'bg-accent',
    pulse: true
  },
  live: {
    label: 'Live',
    color: 'bg-event-positive',
    pulse: false
  },
  reconnecting: {
    label: 'Reconnecting',
    color: 'bg-event-warning',
    pulse: true
  },
  offline: {
    label: 'Offline',
    color: 'bg-muted-foreground',
    pulse: false
  }
} as const;

export const ConnectionStatus = () => {
  const { status } = useConnection();
  const config = statusConfig[status];

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-card">
      <div
        className={cn(
          "w-2 h-2 rounded-full transition-smooth",
          config.color,
          config.pulse && "animate-pulse"
        )}
      />
      <span className="text-sm font-medium text-foreground">
        {config.label}
      </span>
    </div>
  );
};