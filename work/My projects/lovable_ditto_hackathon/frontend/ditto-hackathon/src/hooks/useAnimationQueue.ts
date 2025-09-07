import { useState, useCallback, useRef } from 'react';

export interface AnimationEffect {
  id: string;
  type: 'cry' | 'dance' | 'rage' | 'sleep' | 'party';
  duration: number;
  timestamp: number;
}

export interface AnimationState {
  currentAnimation: AnimationEffect | null;
  queue: AnimationEffect[];
  isOnCooldown: boolean;
}

export const useAnimationQueue = (cooldownDuration: number = 500) => {
  const [state, setState] = useState<AnimationState>({
    currentAnimation: null,
    queue: [],
    isOnCooldown: false
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  const processQueue = useCallback(() => {
    setState(prevState => {
      if (prevState.currentAnimation || prevState.queue.length === 0) {
        return prevState;
      }

      const [nextAnimation, ...remainingQueue] = prevState.queue;
      return {
        ...prevState,
        currentAnimation: nextAnimation,
        queue: remainingQueue
      };
    });
  }, []);

  const completeAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setState(prevState => ({
      ...prevState,
      currentAnimation: null,
      isOnCooldown: true
    }));

    // Start cooldown
    cooldownRef.current = setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        isOnCooldown: false
      }));
      // Process next animation after cooldown
      setTimeout(processQueue, 50);
    }, cooldownDuration);
  }, [cooldownDuration, processQueue]);

  const queueAnimation = useCallback((type: AnimationEffect['type']) => {
    const durations: Record<AnimationEffect['type'], number> = {
      cry: 1500,
      dance: 2000,
      rage: 1000,
      sleep: 2000,
      party: 1500
    };

    const newAnimation: AnimationEffect = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      duration: durations[type],
      timestamp: Date.now()
    };

    setState(prevState => {
      // If on cooldown or currently animating, add to queue
      if (prevState.isOnCooldown || prevState.currentAnimation) {
        // Prevent spamming the same animation type
        const hasRecentSameType = prevState.queue.some(
          anim => anim.type === type && Date.now() - anim.timestamp < 3000
        );
        
        if (hasRecentSameType) {
          return prevState;
        }

        return {
          ...prevState,
          queue: [...prevState.queue, newAnimation]
        };
      }

      // Start animation immediately
      return {
        ...prevState,
        currentAnimation: newAnimation
      };
    });

    // Auto-complete animation after its duration
    timeoutRef.current = setTimeout(completeAnimation, durations[type]);
  }, [completeAnimation]);

  const clearQueue = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (cooldownRef.current) {
      clearTimeout(cooldownRef.current);
      cooldownRef.current = null;
    }

    setState({
      currentAnimation: null,
      queue: [],
      isOnCooldown: false
    });
  }, []);

  return {
    currentAnimation: state.currentAnimation,
    queueLength: state.queue.length,
    isOnCooldown: state.isOnCooldown,
    queueAnimation,
    completeAnimation,
    clearQueue
  };
};