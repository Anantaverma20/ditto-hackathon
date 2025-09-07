import { Progress } from '@/components/ui/progress';
import { useChaosMeter } from '@/contexts/ChaosMeter';
import { cn } from '@/lib/utils';

export function ChaosMeter() {
  const { chaosLevel, getChaosColor, getChaosLabel } = useChaosMeter();
  
  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-lg shadow-card">
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
        Chaos Meter
      </span>
      
      <div className="relative w-24">
        <Progress 
          value={chaosLevel} 
          className="h-2"
        />
        <div 
          className={cn(
            "absolute inset-0 h-2 rounded-full transition-all duration-500",
            `bg-${getChaosColor()}`
          )} 
          style={{ width: `${chaosLevel}%` }}
        />
      </div>
      
      <span className={cn(
        "text-xs font-semibold min-w-[3rem] text-center transition-colors duration-300",
        chaosLevel <= 25 && "text-chaos-low",
        chaosLevel > 25 && chaosLevel <= 50 && "text-chaos-medium", 
        chaosLevel > 50 && chaosLevel <= 75 && "text-chaos-high",
        chaosLevel > 75 && "text-chaos-critical animate-pulse"
      )}>
        {getChaosLabel()}
      </span>
    </div>
  );
}