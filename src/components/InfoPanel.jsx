import React, { useState } from 'react';
import { getCoordinatesInfo, REGION_COLORS } from '../utils/gisUtils';

const InfoPanel = ({ selectedCityData, onClose, onZoomToCity }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showHint, setShowHint] = useState(true);

  if (!selectedCityData) {
    if (!showHint) return null;
    return (
      <div className="info-panel-hint">
        <span className="hint-icon">💡</span>
        <span>Haritada bir ile tıklayarak veya arama yaparak detaylı CBS koordinatlarını görüntüleyin.</span>
        <button
          type="button"
          aria-label="İpucunu Kapat"
          className="hint-close-btn"
          onClick={() => setShowHint(false)}
          title="Kapat"
        >
          ✕
        </button>
      </div>
    );
  }

  const { name, plate, region, center } = selectedCityData;
  const coordsInfo = center ? getCoordinatesInfo(center[0], center[1]) : null;
  const regionColor = REGION_COLORS[region] || REGION_COLORS.Default;

  return (
    <div className={`info-panel-card ${collapsed ? 'collapsed' : ''}`}>
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-plate-badge" style={{ backgroundColor: regionColor }}>
            {plate}
          </span>
          <div>
            <h2 className="panel-city-name">{name}</h2>
            <span className="panel-city-region" style={{ color: regionColor }}>
              {region} Bölgesi
            </span>
          </div>
        </div>
        <div className="panel-actions">
          <button
            type="button"
            aria-label={collapsed ? "Paneli Genişlet" : "Paneli Daralt"}
            aria-expanded={!collapsed}
            className="panel-btn-icon"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Genişlet' : 'Daralt'}
          >
            {collapsed ? '▲' : '▼'}
          </button>
          <button
            type="button"
            aria-label="Paneli Kapat"
            className="panel-btn-icon"
            onClick={onClose}
            title="Kapat"
          >
            ✕
          </button>
        </div>
      </div>

      {!collapsed && coordsInfo && (
        <div className="panel-body">
          <div className="gis-section-title">
            <span>🌐 Coğrafi Bilgi Sistemi (CBS) Verileri</span>
          </div>

          <div className="gis-grid">
            <div className="gis-cell">
              <span className="gis-label">WGS84 Enlem / Boylam:</span>
              <span className="gis-value">{coordsInfo.wgs84.formatted}</span>
              <span className="gis-subvalue">
                {coordsInfo.wgs84.lat}, {coordsInfo.wgs84.lng}
              </span>
            </div>

            <div className="gis-cell">
              <span className="gis-label">Proj4 / Web Mercator:</span>
              <span className="gis-value">EPSG:3857</span>
              <span className="gis-subvalue">
                X: {coordsInfo.mercator.x.toLocaleString('tr-TR')} m
                <br />
                Y: {coordsInfo.mercator.y.toLocaleString('tr-TR')} m
              </span>
            </div>

            <div className="gis-cell">
              <span className="gis-label">Proj4 / UTM Dilimi:</span>
              <span className="gis-value">{coordsInfo.utm.code}</span>
              <span className="gis-subvalue">
                Doğu (E): {coordsInfo.utm.easting.toLocaleString('tr-TR')} m
                <br />
                Kuzey (N): {coordsInfo.utm.northing.toLocaleString('tr-TR')} m
              </span>
            </div>
          </div>

          <div className="panel-footer-actions">
            <button
              type="button"
              className="btn-zoom-focus"
              onClick={() => onZoomToCity(selectedCityData)}
            >
              🎯 İle Odaklan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
