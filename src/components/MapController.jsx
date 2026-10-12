import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapController = ({ targetBounds, targetCenter, targetZoom }) => {
  const map = useMap();

  useEffect(() => {
    if (targetBounds) {
      try {
        map.fitBounds(targetBounds, {
          padding: [50, 50],
          maxZoom: 9,
          animate: true,
          duration: 1,
        });
      } catch (err) {
        // Fallback to center if fitBounds fails
        if (targetCenter) {
          map.flyTo(targetCenter, targetZoom || 7, { duration: 1 });
        }
      }
    } else if (targetCenter) {
      map.flyTo(targetCenter, targetZoom || 6, { duration: 1 });
    }
  }, [map, targetBounds, targetCenter, targetZoom]);

  return null;
};

export default MapController;
