import React, { useEffect, useRef, useState } from "react";
import { MapContainer, GeoJSON, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import proj4 from "proj4";
import turkeyGeoJSON from "./tr-cities.json";

proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

const TurkeyMap = () => {
  const mapRef = useRef();
  const [highlightedCity, setHighlightedCity] = useState(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo([39.9255, 32.8609], 6);
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
      color: feature.properties.name === highlightedCity ? "red" : "black",
      weight: 1,
      fillColor: feature.properties.name === highlightedCity ? "red" : "transparent",
      fillOpacity: 0.5,
    };
  };

  return (
    <MapContainer
      center={[39.9255, 32.8609]}
      zoom={6}
      style={{ height: "100vh", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        url={process.env.PUBLIC_URL + "/map.png"}
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
