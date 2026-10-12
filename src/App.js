import React, { useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import turkeyGeoJSON from './tr-cities.json';
import Header from './components/Header';
import InfoPanel from './components/InfoPanel';
import MapController from './components/MapController';
import FooterBadge from './components/FooterBadge';
import {
  TURKEY_INITIAL_CENTER,
  TURKEY_INITIAL_ZOOM,
  REGION_COLORS,
  BASEMAPS,
  getRegionBounds,
} from './utils/gisUtils';
import './App.css';

const TurkeyMap = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('Tümü');
  const [activeBasemap, setActiveBasemap] = useState('cartoLight');
  const [colorMode, setColorMode] = useState('regions'); // 'regions' or 'plain'

  const [targetBounds, setTargetBounds] = useState(null);
  const [targetCenter, setTargetCenter] = useState(TURKEY_INITIAL_CENTER);
  const [targetZoom, setTargetZoom] = useState(TURKEY_INITIAL_ZOOM);

  // Extract cities array and map
  const { cities, cityMap } = useMemo(() => {
    const list = turkeyGeoJSON.features.map((f) => f.properties);
    const map = {};
    list.forEach((c) => {
      map[c.name] = c;
    });
    return { cities: list, cityMap: map };
  }, []);

  const selectedCityData = selectedCity ? cityMap[selectedCity] : null;

  // Zoom to city bounds
  const zoomToCityFeature = useCallback((cityData) => {
    if (!cityData) return;
    if (cityData.bbox) {
      const [w, s, e, n] = cityData.bbox;
      setTargetBounds([
        [s, w],
        [n, e],
      ]);
    } else if (cityData.center) {
      setTargetBounds(null);
      setTargetCenter(cityData.center);
      setTargetZoom(8);
    }
  }, []);

  // Handle city selection (from map or search)
  const handleSelectCity = useCallback(
    (cityName) => {
      if (selectedCity === cityName) {
        // Toggle off if clicked again
        setSelectedCity(null);
        return;
      }
      setSelectedCity(cityName);
      const data = cityMap[cityName];
      if (data) {
        zoomToCityFeature(data);
      }
    },
    [selectedCity, cityMap, zoomToCityFeature]
  );

  // Handle region filter selection
  const handleSelectRegion = useCallback(
    (regionName) => {
      setSelectedRegion(regionName);
      setSelectedCity(null);

      if (regionName === 'Tümü') {
        setTargetBounds(null);
        setTargetCenter(TURKEY_INITIAL_CENTER);
        setTargetZoom(TURKEY_INITIAL_ZOOM);
      } else {
        const bounds = getRegionBounds(regionName, turkeyGeoJSON.features);
        if (bounds) {
          setTargetBounds(bounds);
        }
      }
    },
    []
  );

  // Reset to full Turkey view
  const handleResetView = useCallback(() => {
    setSelectedCity(null);
    setSelectedRegion('Tümü');
    setTargetBounds(null);
    setTargetCenter(TURKEY_INITIAL_CENTER);
    setTargetZoom(TURKEY_INITIAL_ZOOM);
  }, []);

  // Toggle regional coloring vs clean monochrome
  const handleToggleColorMode = useCallback(() => {
    setColorMode((prev) => (prev === 'regions' ? 'plain' : 'regions'));
  }, []);

  // Compute dynamic styling for each GeoJSON feature
  const getStyle = useCallback(
    (feature) => {
      const name = feature.properties.name;
      const region = feature.properties.region;

      const isSelected = selectedCity === name;
      const isHovered = hoveredCity === name;
      const isRegionActive =
        selectedRegion !== 'Tümü' && region === selectedRegion;
      const isDimmed =
        selectedRegion !== 'Tümü' && region !== selectedRegion;

      if (isSelected) {
        return {
          fillColor: '#F59E0B', // Vibrant amber
          weight: 3,
          color: '#FFFFFF',
          fillOpacity: 0.85,
        };
      }

      if (isHovered) {
        return {
          fillColor:
            colorMode === 'regions'
              ? REGION_COLORS[region] || REGION_COLORS.Default
              : '#3B82F6',
          weight: 2.5,
          color: '#0F172A',
          fillOpacity: 0.85,
        };
      }

      if (isDimmed) {
        return {
          fillColor: '#94A3B8',
          weight: 0.8,
          color: '#E2E8F0',
          fillOpacity: 0.12,
        };
      }

      return {
        fillColor:
          colorMode === 'regions'
            ? REGION_COLORS[region] || REGION_COLORS.Default
            : '#475569',
        weight: 1.2,
        color: '#FFFFFF',
        fillOpacity: isRegionActive ? 0.75 : 0.55,
      };
    },
    [selectedCity, hoveredCity, selectedRegion, colorMode]
  );

  // Setup Leaflet event handlers for each polygon feature
  const onEachFeature = useCallback(
    (feature, layer) => {
      const { name, plate, region } = feature.properties;

      layer.on({
        click: (e) => {
          handleSelectCity(name);
          // Prevent click from propagating to map
          if (e.originalEvent) {
            e.originalEvent.stopPropagation();
          }
        },
        mouseover: () => {
          setHoveredCity(name);
          layer.bringToFront();
        },
        mouseout: () => {
          setHoveredCity((prev) => (prev === name ? null : prev));
        },
      });

      layer.bindTooltip(
        `<div class="tooltip-inner">
          <span class="tooltip-plate">${plate}</span>
          <span class="tooltip-name">${name}</span>
          <span class="tooltip-region">${region}</span>
        </div>`,
        {
          sticky: true,
          direction: 'top',
          offset: [0, -10],
          className: 'leaflet-custom-tooltip',
        }
      );
    },
    [handleSelectCity]
  );

  const currentBasemap = BASEMAPS[activeBasemap] || BASEMAPS.cartoLight;

  return (
    <div className="app-layout">
      {/* Top Header & Navigation */}
      <Header
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        selectedRegion={selectedRegion}
        onSelectRegion={handleSelectRegion}
        activeBasemap={activeBasemap}
        onChangeBasemap={setActiveBasemap}
        colorMode={colorMode}
        onToggleColorMode={handleToggleColorMode}
        onResetView={handleResetView}
      />

      {/* Main Map Area */}
      <main className="map-wrapper">
        <MapContainer
          center={TURKEY_INITIAL_CENTER}
          zoom={TURKEY_INITIAL_ZOOM}
          className="leaflet-map"
          scrollWheelZoom={true}
          zoomSnap={0.5}
        >
          <TileLayer
            key={currentBasemap.id}
            url={currentBasemap.url}
            attribution={currentBasemap.attribution}
            maxZoom={currentBasemap.maxZoom}
            subdomains={currentBasemap.subdomains || 'abc'}
          />

          <GeoJSON
            key={`${selectedCity}-${selectedRegion}-${colorMode}`}
            data={turkeyGeoJSON}
            style={getStyle}
            onEachFeature={onEachFeature}
          />

          <MapController
            targetBounds={targetBounds}
            targetCenter={targetCenter}
            targetZoom={targetZoom}
          />
        </MapContainer>

        {/* Floating GIS Info Panel */}
        <InfoPanel
          selectedCityData={selectedCityData}
          onClose={() => setSelectedCity(null)}
          onZoomToCity={zoomToCityFeature}
        />
      </main>

      {/* Developer Footer & Tech Badges */}
      <FooterBadge />
    </div>
  );
};

export default TurkeyMap;
