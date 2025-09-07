import { Clock, Activity, MessageCircle, Coffee, Calendar, AlertCircle, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockEvents, Event } from '@/data/mockData';
import { useConnection } from '@/contexts/ConnectionContext';

const getEventIcon = (action: string, type?: string) => {
  if (type === 'error') return AlertCircle;
  switch (action) {
    case 'joined': case 'left': return Activity;
    case 'message': return MessageCircle;
    case 'break': return Coffee;
    case 'meeting': return Calendar;
    default: return Activity;
  }
};

const getEventColor = (action: string, type?: string) => {
  if (type === 'error') return 'text-destructive bg-destructive/10';
  switch (action) {
    case 'joined': return 'text-event-positive bg-event-positive/10';
    case 'left': return 'text-muted-foreground bg-muted';
    case 'message': return 'text-event-neutral bg-event-neutral/10';
    case 'break': return 'text-accent-foreground bg-accent/20';
    case 'meeting': return 'text-event-warning bg-event-warning/10';
    default: return 'text-muted-foreground bg-muted';
  }
};

function EventItem({ event }: { event: Event }) {
  const Icon = getEventIcon(event.action, event.type);
  const colorClass = getEventColor(event.action, event.type);
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
      <div className={cn("p-2 rounded-full flex-shrink-0", colorClass)}>
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "font-medium truncate",
            event.type === 'error' ? 'text-destructive' : 'text-foreground'
          )}>
            {event.displayName}
          </span>
          <span className="text-xs text-muted-foreground capitalize">
            {event.action}
          </span>
          {event.mediaUrl && (
            <Image className="w-3 h-3 text-accent" />
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
          {event.preview}
        </p>

        {event.mediaUrl && (
          <div className="mb-2">
            <img 
              src={event.mediaUrl} 
              alt="Event media"
              className="max-w-32 h-20 object-cover rounded border border-border"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {event.type === 'error' && event.errorMessage && (
          <p className="text-xs text-destructive bg-destructive/5 p-2 rounded mb-1">
            {event.errorMessage}
          </p>
        )}
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {event.relativeTime}
        </div>
      </div>
    </div>
  );
}

export function EventLog() {
  const { events, status } = useConnection();
  
  // Show live events if available, otherwise show mock data
  const displayEvents = events.length > 0 ? events : mockEvents;

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col shadow-panel">
      <div className="p-6 border-b border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Live Event Log
        </h2>
        <p className="text-sm text-muted-foreground">
          Recent office activity {events.length > 0 && `(${events.length} live events)`}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {displayEvents.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {status === 'live' ? 'Auto-refresh enabled' : 'Connection inactive'}
          </span>
          <div className="flex items-center gap-1">
            <div className={cn(
              "w-2 h-2 rounded-full",
              status === 'live' ? 'bg-event-positive animate-pulse' : 'bg-muted-foreground'
            )} />
            <span className="capitalize">{status === 'live' ? 'Live' : status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}