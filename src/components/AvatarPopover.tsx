import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/utils/timeFormatting';
import { useConnection } from '@/contexts/ConnectionContext';
import { mockEvents, Event } from '@/data/mockData';
import { 
  Droplets, 
  PartyPopper, 
  Music, 
  Flame, 
  Moon, 
  MessageCircle, 
  UserPlus, 
  UserMinus, 
  Coffee, 
  Users, 
  Activity,
  Clock
} from 'lucide-react';

interface AvatarPopoverProps {
  userId: string;
  displayName: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  children: React.ReactNode;
}

const getActionIcon = (action: string) => {
  const actionLower = action.toLowerCase();
  const iconProps = { className: "w-3 h-3", strokeWidth: 2 };
  
  switch (actionLower) {
    case 'cry':
    case 'crying':
    case 'sad':
    case 'tear':
      return <Droplets {...iconProps} className="w-3 h-3 text-blue-500" />;
    case 'dance':
    case 'dancing':
    case 'groove':
    case 'boogie':
      return <Music {...iconProps} className="w-3 h-3 text-purple-500" />;
    case 'rage':
    case 'angry':
    case 'mad':
    case 'furious':
    case 'anger':
      return <Flame {...iconProps} className="w-3 h-3 text-red-500" />;
    case 'sleep':
    case 'sleeping':
    case 'nap':
    case 'tired':
    case 'zzz':
      return <Moon {...iconProps} className="w-3 h-3 text-gray-500" />;
    case 'party':
    case 'celebrate':
    case 'celebration':
    case 'hooray':
    case 'yay':
      return <PartyPopper {...iconProps} className="w-3 h-3 text-pink-500" />;
    case 'joined':
      return <UserPlus {...iconProps} className="w-3 h-3 text-green-500" />;
    case 'left':
      return <UserMinus {...iconProps} className="w-3 h-3 text-orange-500" />;
    case 'message':
      return <MessageCircle {...iconProps} className="w-3 h-3 text-blue-500" />;
    case 'break':
      return <Coffee {...iconProps} className="w-3 h-3 text-amber-500" />;
    case 'meeting':
      return <Users {...iconProps} className="w-3 h-3 text-indigo-500" />;
    default:
      return <Activity {...iconProps} className="w-3 h-3 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'text-green-500';
    case 'away': return 'text-yellow-500';
    case 'busy': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

const getStatusIcon = (status: string) => {
  return (
    <div className={cn(
      "w-2 h-2 rounded-full",
      status === 'online' ? 'bg-green-500' : 
      status === 'away' ? 'bg-yellow-500' : 
      status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
    )} />
  );
};

export function AvatarPopover({ userId, displayName, status, children }: AvatarPopoverProps) {
  const [open, setOpen] = useState(false);
  const { events } = useConnection();
  
  // Get events for this user (live events if available, otherwise mock data)
  const allEvents = events.length > 0 ? events : mockEvents;
  const userEvents = allEvents
    .filter(event => event.userId === userId)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5); // Last 5 actions

  const lastMessage = userEvents.find(event => event.action.toLowerCase() === 'message');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="center" side="top">
        <div className="p-4 space-y-4">
          {/* Header with user info */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{displayName}</h3>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(status)}
                <span className={cn("text-sm capitalize", getStatusColor(status))}>
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Last message */}
          {lastMessage && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <MessageCircle className="w-3 h-3" />
                Last Message
              </h4>
              <div className="bg-muted/30 rounded-md p-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {lastMessage.messageText}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(lastMessage.timestamp)}
                </div>
              </div>
            </div>
          )}

          {/* Recent actions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Activity className="w-3 h-3" />
              Recent Actions ({userEvents.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {userEvents.length > 0 ? (
                userEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-md"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getActionIcon(event.action)}
                      <Badge 
                        variant="secondary" 
                        className="text-xs capitalize flex-shrink-0"
                      >
                        {event.action}
                      </Badge>
                      <span className="text-xs text-muted-foreground truncate">
                        {event.messageText.substring(0, 30)}
                        {event.messageText.length > 30 ? '...' : ''}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {formatRelativeTime(event.timestamp)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No recent actions
                </div>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}