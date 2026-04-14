import { RefObject, useCallback } from 'react';

export interface NaverMapInstance {
  getZoom: () => number;
  setZoom: (zoom: number) => void;
  setCenter: (latlng: unknown) => void;
  destroy: () => void;
}

export const useMapZoom = (
  mapInstanceRef: RefObject<NaverMapInstance | null>,
) => {
  const zoomIn = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map) map.setZoom(map.getZoom() + 1);
  }, [mapInstanceRef]);

  const zoomOut = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map) map.setZoom(map.getZoom() - 1);
  }, [mapInstanceRef]);

  return { zoomIn, zoomOut };
};
