import { MutableRefObject, useCallback } from 'react';

export const useMapZoom = (mapInstanceRef: MutableRefObject<any>) => {
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
