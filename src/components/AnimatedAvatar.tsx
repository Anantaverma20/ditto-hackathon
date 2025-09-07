import { cn } from "@/lib/utils";
import { useAnimationQueue, AnimationEffect } from '@/hooks/useAnimationQueue';
import { useMediaOverlays } from '@/hooks/useMediaOverlays';
import { TearBubble, ZzzBubble, BoomPopover, ConfettiBurst } from './animations/AnimationEffects';
import { MediaOverlay } from './animations/MediaOverlay';
import { useConnectionEvents } from '@/hooks/useConnectionEvents';
import { useEffect } from 'react';

interface AnimatedAvatarProps {
  userId: string;
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

const getAnimationClass = (animation: AnimationEffect | null) => {
  if (!animation) return '';
  
  switch (animation.type) {
    case 'cry': return 'animate-shake';
    case 'dance': return 'animate-dance-rotate';
    case 'rage': return 'animate-screen-shake';
    case 'sleep': return 'opacity-50';
    case 'party': return 'animate-bounce-party';
    default: return '';
  }
};

export function AnimatedAvatar({ userId, name, initials, colorIndex, status = 'offline', className }: AnimatedAvatarProps) {
  const { currentAnimation, queueAnimation, completeAnimation } = useAnimationQueue(1000);
  const { overlays, addOverlay, removeOverlay } = useMediaOverlays(2);
  
  // Listen for connection events and trigger animations
  useConnectionEvents((event) => {
    if (event.userId === userId && event.type === 'event') {
      const action = event.action.toLowerCase();
      
      // Handle media URL if present
      if (event.mediaUrl) {
        addOverlay(event.mediaUrl);
      }
      
      // Map action keywords to animation types
      if (['cry', 'crying', 'sad', 'tear'].includes(action)) {
        queueAnimation('cry');
      } else if (['dance', 'dancing', 'groove', 'boogie'].includes(action)) {
        queueAnimation('dance');
      } else if (['rage', 'angry', 'mad', 'furious', 'anger'].includes(action)) {
        queueAnimation('rage');
      } else if (['sleep', 'sleeping', 'nap', 'tired', 'zzz'].includes(action)) {
        queueAnimation('sleep');
      } else if (['party', 'celebrate', 'celebration', 'hooray', 'yay'].includes(action)) {
        queueAnimation('party');
      }
    }
  });

  const animationClass = getAnimationClass(currentAnimation);

  return (
    <div className={cn("flex flex-col items-center group cursor-pointer relative", className)}>
      {/* Media Overlays */}
      {overlays.map((overlay) => (
        <MediaOverlay
          key={overlay.id}
          overlay={overlay}
          onDismiss={removeOverlay}
        />
      ))}
      
      {/* Animation Effects */}
      <TearBubble 
        show={currentAnimation?.type === 'cry'} 
        onComplete={completeAnimation}
      />
      <ZzzBubble 
        show={currentAnimation?.type === 'sleep'} 
        onComplete={completeAnimation}
      />
      <BoomPopover 
        show={currentAnimation?.type === 'rage'} 
        onComplete={completeAnimation}
      />
      <ConfettiBurst 
        show={currentAnimation?.type === 'dance' || currentAnimation?.type === 'party'} 
        onComplete={completeAnimation}
      />
      
      {/* Avatar Container */}
      <div className="relative">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-lg",
          "shadow-avatar transition-all duration-300 group-hover:scale-105",
          "group-hover:shadow-lg",
          getAvatarColor(colorIndex),
          animationClass
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