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
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <MapContainer
        ref={mapRef}
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: "100%", width: "100%" }}
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
      <div style={{ position: "absolute", bottom: "10px", right: "10px", zIndex: 1000, background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(4px)", padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem", color: "#333", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        Geliştirici: <a href="https://www.yucelgumus.dev/" target="_blank" rel="noopener noreferrer" style={{ color: "#0066cc", textDecoration: "underline", fontWeight: 600 }}>Yücel Gümüş</a>
      </div>
    </div>
  );
};

export default TurkeyMap;
