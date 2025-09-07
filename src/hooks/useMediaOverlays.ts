import { useState, useCallback } from 'react';
import { MediaOverlayData } from '@/components/animations/MediaOverlay';

export const useMediaOverlays = (maxOverlays: number = 2) => {
  const [overlays, setOverlays] = useState<MediaOverlayData[]>([]);

  const addOverlay = useCallback((mediaUrl: string) => {
    const newOverlay: MediaOverlayData = {
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: mediaUrl,
      timestamp: Date.now(),
      stackPosition: 0 // Will be recalculated
    };

    setOverlays(prevOverlays => {
      // Remove oldest overlays if we exceed the limit
      const trimmedOverlays = prevOverlays.slice(0, maxOverlays - 1);
      
      // Add new overlay and recalculate stack positions
      const updatedOverlays = [newOverlay, ...trimmedOverlays].map((overlay, index) => ({
        ...overlay,
        stackPosition: index
      }));

      return updatedOverlays;
    });
  }, [maxOverlays]);

  const removeOverlay = useCallback((overlayId: string) => {
    setOverlays(prevOverlays => {
      const filtered = prevOverlays.filter(overlay => overlay.id !== overlayId);
      
      // Recalculate stack positions after removal
      return filtered.map((overlay, index) => ({
        ...overlay,
        stackPosition: index
      }));
    });
  }, []);

  const clearAllOverlays = useCallback(() => {
    setOverlays([]);
  }, []);

  return {
    overlays,
    addOverlay,
    removeOverlay,
    clearAllOverlays
  };
};