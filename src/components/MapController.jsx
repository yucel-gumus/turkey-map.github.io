import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapController = ({ targetBounds, targetCenter, targetZoom }) => {
  const map = useMap();

  useEffect(() => {
    if (targetBounds) {
      try {
        map.fitBounds(targetBounds, {
          padding: [30, 30],
          maxZoom: 9,
          animate: true,
          duration: 0.5,
        });
      } catch (err) {
        // Fallback to center if fitBounds fails
        if (targetCenter) {
          map.flyTo(targetCenter, targetZoom || 7, { duration: 0.5 });
        }
      }
    } else if (targetCenter) {
      map.flyTo(targetCenter, targetZoom || 6, { duration: 0.5 });
    }
  }, [map, targetBounds, targetCenter, targetZoom]);

  return null;
};

export default MapController;
