import { RotateCcw, EyeOff, Accessibility, Building2, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChaosMeter } from '@/components/ChaosMeter';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useOfficeSettings } from '@/contexts/OfficeSettings';
import { useConnection } from '@/contexts/ConnectionContext';
import { cn } from '@/lib/utils';

export function OfficeControlBar() {
  const { 
    muteMemes, 
    reduceMotion, 
    selectedRoom, 
    availableRooms,
    toggleMuteMemes,
    toggleReduceMotion,
    setSelectedRoom,
    resetOffice
  } = useOfficeSettings();
  
  const { status, events } = useConnection();
  const isLive = status === 'live';

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the office? This will clear all avatars, animations, and event log.')) {
      resetOffice();
    }
  };

  return (
    <div className="bg-gradient-card border-b border-border/50 px-4 py-3 shadow-card backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Office Chaos Title */}
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Office Chaos</h1>
            {isLive && <Badge variant="joined" className="text-xs">Live</Badge>}
          </div>
          
          {/* Room Selector */}
          {availableRooms.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Room:</span>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map(room => (
                    <SelectItem key={room} value={room}>
                      {room === 'all' ? 'All Rooms' : room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Center - Chaos Meter */}
        <ChaosMeter />

        {/* Controls */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {/* Mute Memes Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={muteMemes ? "secondary" : "ghost"}
                  size="sm"
                  onClick={toggleMuteMemes}
                  className={cn(
                    "h-8 px-3 shadow-button",
                    muteMemes && "bg-muted text-muted-foreground"
                  )}
                >
                  {muteMemes ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  <span className="text-xs">
                    {muteMemes ? 'Muted' : 'Memes'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{muteMemes ? 'Show media overlays' : 'Hide media overlays'}</p>
              </TooltipContent>
            </Tooltip>

            {/* Reduce Motion Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={reduceMotion ? "secondary" : "ghost"}
                  size="sm"
                  onClick={toggleReduceMotion}
                  className={cn(
                    "h-8 px-3 shadow-button",
                    reduceMotion && "bg-accent/20 text-accent-foreground"
                  )}
                >
                  {reduceMotion ? <Accessibility className="w-4 h-4 mr-1" /> : <Zap className="w-4 h-4 mr-1" />}
                  <span className="text-xs">
                    {reduceMotion ? 'Reduced' : 'Motion'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{reduceMotion ? 'Enable animations' : 'Reduce motion for accessibility'}</p>
              </TooltipContent>
            </Tooltip>

            {/* Reset Office */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 px-3 text-destructive hover:text-destructive shadow-button"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  <span className="text-xs">Reset</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear all avatars, animations, and event log</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 ml-2 px-2 py-1 bg-muted/30 rounded-md shadow-sm">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isLive ? 'bg-event-positive animate-pulse' : 'bg-muted-foreground'
            )} />
            <span className="text-xs text-muted-foreground capitalize">
              {isLive ? 'Live' : status}
            </span>
            {events.length > 0 && (
              <Badge variant="secondary" className="text-xs ml-1">
                {events.length}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}