import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import turkeyGeoJSON from "./tr-cities.json";

const TurkeyMap = () => {
  const mapRef = useRef();
  const [highlightedCity, setHighlightedCity] = useState(null);

  const initialCenter = [39, 35]; // Turkey center coordinates (approx)
  const initialZoom = 6;

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo(initialCenter, initialZoom);
    }
  }, []);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        setHighlightedCity(feature.properties.name);
      },
    });

    layer.bindPopup(feature.properties.name, {
      closeButton: false,
      className: 'popup-label'
    });
  };

  const getStyle = (feature) => {
    return {
      fillColor:
        feature.properties.name === highlightedCity ? "#FFFF00" : "#808080", // Highlight yellow, default grey
      weight: 1,
      fillOpacity: 0.5,
    };
  };

  return (
    <MapContainer
      ref={mapRef}
      center={initialCenter}
      zoom={initialZoom}
      style={{ height: "100vh", width: "100%" }}
      scrollWheelZoom={true}
      zoomSnap={0.1}
    >
      <TileLayer
        url={process.env.PUBLIC_URL + "/map.png"} // Reverted to original
        opacity={1}
        zIndex={0}
      />
      <GeoJSON
        data={turkeyGeoJSON}
        style={getStyle}
        onEachFeature={(feature, layer) => {
          onEachFeature(feature, layer);
          if (feature.properties.name === highlightedCity) {
            layer.openPopup();
          } else {
            layer.closePopup();
          }
        }}
      />
    </MapContainer>
  );
};

export default TurkeyMap;
