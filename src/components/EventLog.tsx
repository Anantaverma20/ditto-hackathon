import { useState, useMemo } from 'react';
import { Search, Filter, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { mockEvents, Event } from '@/data/mockData';
import { useConnection } from '@/contexts/ConnectionContext';
import { formatRelativeTime } from '@/utils/timeFormatting';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const getActionBadgeVariant = (action: string, type?: string): BadgeVariant => {
  if (type === 'error') return 'error';
  
  switch (action.toLowerCase()) {
    case 'joined': return 'joined';
    case 'left': return 'left';
    case 'message': return 'message';
    case 'break': return 'break';
    case 'meeting': return 'meeting';
    case 'cry': case 'crying': case 'sad': case 'tear': return 'cry';
    case 'dance': case 'dancing': case 'groove': case 'boogie': return 'dance';
    case 'rage': case 'angry': case 'mad': case 'furious': case 'anger': return 'rage';
    case 'sleep': case 'sleeping': case 'nap': case 'tired': case 'zzz': return 'sleep';
    case 'party': case 'celebrate': case 'celebration': case 'hooray': case 'yay': return 'party';
    default: return 'secondary';
  }
};

function EventRow({ event }: { event: Event }) {
  const badgeVariant = getActionBadgeVariant(event.action, event.type);
  const truncatedText = event.messageText.length > 80 
    ? event.messageText.substring(0, 77) + '...' 
    : event.messageText;
  
  const relativeTime = formatRelativeTime(event.timestamp);
  
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0">
      {/* User display name */}
      <div className="w-24 flex-shrink-0">
        <span className={cn(
          "text-sm font-medium truncate block",
          event.type === 'error' ? 'text-destructive' : 'text-foreground'
        )}>
          {event.displayName}
        </span>
      </div>
      
      {/* Action badge */}
      <div className="flex-shrink-0">
        <Badge variant={badgeVariant} className="capitalize">
          {event.action}
        </Badge>
      </div>
      
      {/* Message text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground truncate">
            {truncatedText}
          </span>
          {event.mediaUrl && (
            <ImageIcon className="w-3 h-3 text-accent flex-shrink-0" />
          )}
        </div>
        
        {event.type === 'error' && event.errorMessage && (
          <div className="text-xs text-destructive mt-1 truncate">
            Error: {event.errorMessage}
          </div>
        )}
      </div>
      
      {/* Relative time */}
      <div className="w-16 flex-shrink-0 text-right">
        <span className="text-xs text-muted-foreground">
          {relativeTime}
        </span>
      </div>
    </div>
  );
}

export function EventLog() {
  const { events, status } = useConnection();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  
  // Show live events if available, otherwise show mock data
  const allEvents = events.length > 0 ? events : mockEvents;
  
  // Get unique actions for filter dropdown
  const uniqueActions = useMemo(() => {
    const actions = new Set(allEvents.map(event => event.action.toLowerCase()));
    return Array.from(actions).sort();
  }, [allEvents]);
  
  // Filter and search events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // Action filter
      if (actionFilter !== 'all' && event.action.toLowerCase() !== actionFilter) {
        return false;
      }
      
      // Search filter
      if (searchTerm && !event.messageText.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [allEvents, actionFilter, searchTerm]);
  
  const clearFilters = () => {
    setSearchTerm('');
    setActionFilter('all');
  };

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col shadow-panel">
      <div className="p-4 border-b border-border bg-card">
        <div className="mb-3">
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Live Event Log
          </h2>
          <p className="text-sm text-muted-foreground">
            Recent office activity {events.length > 0 && `(${filteredEvents.length}/${events.length} events)`}
          </p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="space-y-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search message text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-8 h-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Filter className="w-3 h-3 mr-1" />
                  {actionFilter === 'all' ? 'All Actions' : actionFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem onClick={() => setActionFilter('all')}>
                  All Actions
                </DropdownMenuItem>
                {uniqueActions.map(action => (
                  <DropdownMenuItem 
                    key={action} 
                    onClick={() => setActionFilter(action)}
                    className="capitalize"
                  >
                    {action}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {(searchTerm || actionFilter !== 'all') && (
              <Button
                variant="ghost" 
                size="sm"
                onClick={clearFilters}
                className="h-8 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredEvents.length > 0 ? (
          <div>
            {filteredEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            {searchTerm || actionFilter !== 'all' 
              ? 'No events match your filters' 
              : 'No events yet'
            }
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-border bg-muted/30">
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