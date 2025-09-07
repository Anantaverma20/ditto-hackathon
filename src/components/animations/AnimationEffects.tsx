import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Tear Bubble Component
export const TearBubble = ({ show, onComplete }: { show: boolean; onComplete: () => void }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div className="bg-blue-400 rounded-full w-3 h-4 relative">
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
      </div>
    </div>
  );
};

// Zzz Bubble Component
export const ZzzBubble = ({ show, onComplete }: { show: boolean; onComplete: () => void }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="absolute -top-12 -right-2 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm border border-border rounded-lg px-2 py-1 shadow-lg">
        <span className="text-sm text-muted-foreground font-medium">Zzz</span>
      </div>
      <div className="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90" />
    </div>
  );
};

// Boom Popover Component
export const BoomPopover = ({ show, onComplete }: { show: boolean; onComplete: () => void }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 animate-scale-in">
      <div className="bg-destructive text-destructive-foreground font-bold text-lg px-3 py-1 rounded-full border-2 border-white shadow-lg relative">
        BOOM!
        <div className="absolute inset-0 bg-destructive rounded-full animate-ping opacity-30" />
      </div>
    </div>
  );
};

// Confetti Burst Component
export const ConfettiBurst = ({ show, onComplete }: { show: boolean; onComplete: () => void }) => {
  const [particles, setParticles] = useState<Array<{ id: number; color: string; delay: number; direction: number }>>([]);

  useEffect(() => {
    if (show) {
      const colors = ['bg-red-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400'];
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        delay: Math.random() * 200,
        direction: (i * 30) % 360
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={cn(
            "absolute top-1/2 left-1/2 w-2 h-2 rounded-full",
            particle.color,
            "animate-confetti-burst"
          )}
          style={{
            transform: `translate(-50%, -50%) rotate(${particle.direction}deg)`,
            animationDelay: `${particle.delay}ms`
          }}
        />
      ))}
    </div>
  );
};