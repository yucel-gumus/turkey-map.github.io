import React, { useState, useRef, useEffect, memo } from 'react';
import { REGIONS, normalizeTurkishText } from '../utils/gisUtils';

const Header = ({
  cities,
  selectedCity,
  onSelectCity,
  selectedRegion,
  onSelectRegion,
  colorMode,
  onToggleColorMode,
  onResetView,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // Filter cities for search
  const filteredCities = searchTerm.trim()
    ? cities.filter((city) => {
        const query = normalizeTurkishText(searchTerm);
        const nameMatch = normalizeTurkishText(city.name).includes(query);
        const plateMatch = city.plate.includes(query) || String(city.number) === query;
        return nameMatch || plateMatch;
      })
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCityClick = (city) => {
    onSelectCity(city.name);
    setSearchTerm('');
    setShowDropdown(false);
  };

  return (
    <header className="app-header">
      <div className="header-top-row">
        <div className="brand-group">
          <span className="brand-flag" role="img" aria-label="Türkiye Bayrağı">
            🇹🇷
          </span>
          <div>
            <h1 className="brand-title">Türkiye İnteraktif Haritası</h1>
            <p className="brand-subtitle">81 İl Sınırları &bull; GeoJSON &amp; Proj4 CBS Gezgini</p>
          </div>
        </div>

        <div className="controls-group">
          {/* Search Bar */}
          <div className="search-container" ref={searchRef}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="İl veya Plaka ara (Örn: 34, Trabzon)..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  title="Temizle"
                >
                  ✕
                </button>
              )}
            </div>

            {showDropdown && filteredCities.length > 0 && (
              <ul className="search-dropdown">
                {filteredCities.slice(0, 10).map((city) => (
                  <li
                    key={city.name}
                    className={`search-dropdown-item ${
                      selectedCity === city.name ? 'active' : ''
                    }`}
                    onClick={() => handleCityClick(city)}
                  >
                    <span className="plate-badge">{city.plate}</span>
                    <span className="city-name">{city.name}</span>
                    <span className="city-region">{city.region}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Color Mode Toggle */}
          <button
            type="button"
            className={`btn-action ${colorMode === 'regions' ? 'active' : ''}`}
            onClick={onToggleColorMode}
            title={
              colorMode === 'regions'
                ? 'Sade renklendirmeye geç'
                : 'Bölgesel renklendirmeye geç'
            }
          >
            🎨 {colorMode === 'regions' ? 'Bölgesel Renk' : 'Sade Renk'}
          </button>

          {/* Reset Map View */}
          <button
            type="button"
            className="btn-action reset-btn"
            onClick={onResetView}
            title="Haritayı Türkiye geneline sıfırla"
          >
            🔄 Türkiye Geneli
          </button>
        </div>
      </div>

      {/* Region Filter Bar */}
      <div className="regions-nav">
        <div className="regions-scroll">
          {REGIONS.map((region) => {
            const isSelected = selectedRegion === region;
            return (
              <button
                key={region}
                type="button"
                className={`region-chip ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectRegion(region)}
              >
                {region}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
