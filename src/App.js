import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import turkeyGeoJSON from './tr-cities.json';
import Header from './components/Header';
import InfoPanel from './components/InfoPanel';
import MapController from './components/MapController';
import FooterBadge from './components/FooterBadge';
import {
  TURKEY_BOUNDS,
  TURKEY_MAX_BOUNDS,
  TURKEY_INITIAL_CENTER,
  TURKEY_INITIAL_ZOOM,
  TURKEY_MIN_ZOOM,
  TURKEY_MAX_ZOOM,
  REGION_COLORS,
  getRegionBounds,
} from './utils/gisUtils';
import './App.css';

const TurkeyMap = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('Tümü');
  const [colorMode, setColorMode] = useState('regions'); // 'regions' or 'plain'

  const [targetBounds, setTargetBounds] = useState(null);
  const [targetCenter, setTargetCenter] = useState(TURKEY_INITIAL_CENTER);
  const [targetZoom, setTargetZoom] = useState(TURKEY_INITIAL_ZOOM);

  const geoJsonRef = useRef(null);

  // Extract cities array and map once
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
        setTargetBounds(TURKEY_BOUNDS);
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

  // Reset to full Turkey view (strictly locked to Turkey)
  const handleResetView = useCallback(() => {
    setSelectedCity(null);
    setSelectedRegion('Tümü');
    setTargetBounds(TURKEY_BOUNDS);
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
      const isRegionActive =
        selectedRegion !== 'Tümü' && region === selectedRegion;
      const isDimmed =
        selectedRegion !== 'Tümü' && region !== selectedRegion;

      if (isSelected) {
        return {
          fillColor: '#F59E0B', // Vibrant amber highlight
          weight: 3,
          color: '#FFFFFF',
          fillOpacity: 0.9,
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
        fillOpacity: isRegionActive ? 0.78 : 0.58,
      };
    },
    [selectedCity, selectedRegion, colorMode]
  );

  // Update styles directly on the Leaflet layer instance without re-mounting DOM
  useEffect(() => {
    if (geoJsonRef.current && typeof geoJsonRef.current.eachLayer === 'function') {
      geoJsonRef.current.eachLayer((layer) => {
        if (layer.feature) {
          layer.setStyle(getStyle(layer.feature));
        }
      });
    }
  }, [getStyle]);

  // Setup Leaflet event handlers for each polygon feature
  const onEachFeature = useCallback(
    (feature, layer) => {
      const { name, plate, region } = feature.properties;

      layer.on({
        click: (e) => {
          handleSelectCity(name);
          if (e.originalEvent) {
            e.originalEvent.stopPropagation();
          }
        },
        mouseover: () => {
          // Instant direct Leaflet layer styling without React re-renders
          layer.setStyle({
            fillOpacity: 0.92,
            weight: 2.5,
            color: '#0F172A',
          });
          layer.bringToFront();
        },
        mouseout: () => {
          layer.setStyle(getStyle(feature));
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
    [handleSelectCity, getStyle]
  );

  return (
    <div className="app-layout">
      {/* Top Header & Navigation */}
      <Header
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        selectedRegion={selectedRegion}
        onSelectRegion={handleSelectRegion}
        colorMode={colorMode}
        onToggleColorMode={handleToggleColorMode}
        onResetView={handleResetView}
      />

      {/* Main Map Area - Strictly bounded to Turkey */}
      <main className="map-wrapper">
        <MapContainer
          bounds={TURKEY_BOUNDS}
          maxBounds={TURKEY_MAX_BOUNDS}
          maxBoundsViscosity={1.0}
          minZoom={TURKEY_MIN_ZOOM}
          maxZoom={TURKEY_MAX_ZOOM}
          zoomSnap={0.25}
          scrollWheelZoom={true}
          attributionControl={false}
          className="leaflet-map"
        >
          {/* Pure Turkey 81 Provinces Vector Layer - No neighboring countries */}
          <GeoJSON
            ref={geoJsonRef}
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
