import { useEffect, useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MediaOverlayData {
  id: string;
  url: string;
  timestamp: number;
  stackPosition: number;
}

interface MediaOverlayProps {
  overlay: MediaOverlayData;
  onDismiss: (id: string) => void;
  className?: string;
}

export const MediaOverlay = ({ overlay, onDismiss, className }: MediaOverlayProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade animation to complete before actually removing
      setTimeout(() => onDismiss(overlay.id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [overlay.id, onDismiss]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  const handleImageError = () => {
    setIsLoaded(false);
    setIsError(true);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(overlay.id), 300);
  };

  const getMediaType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return 'image';
    }
    if (['mp4', 'webm', 'ogg'].includes(extension || '')) {
      return 'video';
    }
    return 'unknown';
  };

  const mediaType = getMediaType(overlay.url);
  const stackOffset = overlay.stackPosition * 50; // 50px vertical offset per stack level

  return (
    <div 
      className={cn(
        "absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 z-20",
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        className
      )}
      style={{ 
        top: `${-120 - stackOffset}px` // Position above avatar with stacking offset
      }}
    >
      <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden max-w-32 min-w-24 relative group">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-1 right-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background rounded-full p-1"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Media content */}
        <div className="relative">
          {mediaType === 'image' ? (
            <>
              {!isLoaded && !isError && (
                <div className="w-28 h-20 bg-muted flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-muted-foreground animate-pulse" />
                </div>
              )}
              
              {isError ? (
                <div className="w-28 h-20 bg-destructive/10 border border-destructive/20 flex flex-col items-center justify-center p-2">
                  <ImageIcon className="w-4 h-4 text-destructive mb-1" />
                  <span className="text-xs text-destructive text-center">Failed to load</span>
                </div>
              ) : (
                <img
                  src={overlay.url}
                  alt="Media content"
                  className="w-full h-20 object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: isLoaded ? 'block' : 'none' }}
                />
              )}
            </>
          ) : mediaType === 'video' ? (
            <video
              src={overlay.url}
              className="w-full h-20 object-cover"
              autoPlay
              muted
              loop
              onLoadedData={() => setIsLoaded(true)}
              onError={handleImageError}
            />
          ) : (
            <div className="w-28 h-20 bg-muted flex flex-col items-center justify-center p-2">
              <ImageIcon className="w-4 h-4 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground text-center">Media</span>
            </div>
          )}
        </div>

        {/* Media type indicator */}
        {isLoaded && (
          <div className="absolute bottom-1 left-1 bg-background/80 rounded px-1 py-0.5">
            <span className="text-xs text-foreground font-medium uppercase">
              {mediaType === 'video' ? 'GIF' : 'IMG'}
            </span>
          </div>
        )}
      </div>
      
      {/* Pointing arrow */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border" />
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-[-1px] w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-card" />
    </div>
  );
};