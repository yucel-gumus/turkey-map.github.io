import proj4 from 'proj4';

// Define standard projections
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
proj4.defs(
  'EPSG:3857',
  '+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs'
);

export const TURKEY_INITIAL_CENTER = [39.0, 35.2];
export const TURKEY_INITIAL_ZOOM = 6;

export const REGIONS = [
  'Tümü',
  'Marmara',
  'Ege',
  'Akdeniz',
  'İç Anadolu',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu Anadolu',
];

export const REGION_COLORS = {
  Marmara: '#3B82F6',       // Blue
  Ege: '#10B981',           // Emerald
  Akdeniz: '#06B6D4',       // Cyan
  'İç Anadolu': '#F59E0B',  // Amber
  Karadeniz: '#059669',     // Green
  'Doğu Anadolu': '#8B5CF6',// Purple
  'Güneydoğu Anadolu': '#EC4899', // Pink
  Default: '#64748B',
};

export const BASEMAPS = {
  osm: {
    id: 'osm',
    name: 'Standart (OpenStreetMap)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  esriLight: {
    id: 'esriLight',
    name: 'Açık Minimal (Esri Canvas)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16,
  },
  esriDark: {
    id: 'esriDark',
    name: 'Koyu Tema (Esri Dark)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16,
  },
  satellite: {
    id: 'satellite',
    name: 'Uydu (Esri Imagery)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    maxZoom: 18,
  },
};


/**
 * Calculates GIS projections for given WGS84 coordinates using Proj4
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 */
export function getCoordinatesInfo(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }

  // Web Mercator EPSG:3857
  const [mercX, mercY] = proj4('EPSG:4326', 'EPSG:3857', [lng, lat]);

  // UTM Zone for Turkey (Zones 35N, 36N, 37N, 38N)
  const zone = Math.floor((lng + 180) / 6) + 1;
  const utmDef = `+proj=utm +zone=${zone} +datum=WGS84 +units=m +no_defs`;
  const [utmEasting, utmNorthing] = proj4('EPSG:4326', utmDef, [lng, lat]);

  return {
    wgs84: {
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
      formatted: `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'K' : 'G'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'D' : 'B'}`,
    },
    mercator: {
      x: Math.round(mercX),
      y: Math.round(mercY),
      code: 'EPSG:3857',
    },
    utm: {
      zone: `${zone}N`,
      easting: Math.round(utmEasting),
      northing: Math.round(utmNorthing),
      code: `WGS84 / UTM ${zone}N`,
    },
  };
}

/**
 * Normalizes Turkish strings for search comparison
 */
export function normalizeTurkishText(str) {
  if (!str) return '';
  return str
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase()
    .trim();
}

/**
 * Calculates Leaflet LatLngBounds [[minLat, minLon], [maxLat, maxLon]] for a region
 */
export function getRegionBounds(regionName, features) {
  if (!regionName || regionName === 'Tümü' || !Array.isArray(features)) return null;
  const filtered = features.filter((f) => f.properties && f.properties.region === regionName);
  if (filtered.length === 0) return null;

  let minLat = 90;
  let maxLat = -90;
  let minLon = 180;
  let maxLon = -180;

  for (const f of filtered) {
    if (!f.properties.bbox) continue;
    const [w, s, e, n] = f.properties.bbox;
    if (s < minLat) minLat = s;
    if (n > maxLat) maxLat = n;
    if (w < minLon) minLon = w;
    if (e > maxLon) maxLon = e;
  }

  return [
    [minLat, minLon],
    [maxLat, maxLon],
  ];
}
