import {
  getCoordinatesInfo,
  normalizeTurkishText,
  REGIONS,
  getRegionBounds,
  TURKEY_INITIAL_CENTER,
  TURKEY_INITIAL_ZOOM,
} from './gisUtils';

describe('gisUtils', () => {
  test('REGIONS includes all 7 regions plus Tümü', () => {
    expect(REGIONS).toHaveLength(8);
    expect(REGIONS).toContain('Marmara');
    expect(REGIONS).toContain('Ege');
    expect(REGIONS).toContain('Karadeniz');
  });

  test('constants are valid numbers', () => {
    expect(TURKEY_INITIAL_CENTER).toHaveLength(2);
    expect(TURKEY_INITIAL_ZOOM).toBe(6);
  });

  test('normalizeTurkishText handles Turkish characters', () => {
    expect(normalizeTurkishText('İstanbul')).toBe('istanbul');
    expect(normalizeTurkishText('IĞDIR')).toBe('ığdır');
    expect(normalizeTurkishText('Şanlıurfa')).toBe('şanlıurfa');
  });

  test('getCoordinatesInfo calculates Mercator and UTM zones correctly', () => {
    const info = getCoordinatesInfo(39.9255, 32.8609);
    expect(info).not.toBeNull();
    expect(info.wgs84.lat).toBe(39.9255);
    expect(info.wgs84.lng).toBe(32.8609);
    expect(info.utm.zone).toBe('36N');
    expect(typeof info.utm.easting).toBe('number');
    expect(typeof info.utm.northing).toBe('number');
    expect(typeof info.mercator.x).toBe('number');
    expect(typeof info.mercator.y).toBe('number');
  });

  test('getCoordinatesInfo returns null for invalid input', () => {
    expect(getCoordinatesInfo(null, undefined)).toBeNull();
  });

  test('getRegionBounds returns correct bounds for sample features', () => {
    const features = [
      {
        properties: {
          region: 'Marmara',
          bbox: [26.0, 40.0, 29.0, 41.5],
        },
      },
      {
        properties: {
          region: 'Marmara',
          bbox: [28.0, 39.5, 30.5, 42.0],
        },
      },
      {
        properties: {
          region: 'Ege',
          bbox: [27.0, 37.0, 29.0, 39.0],
        },
      },
    ];

    const bounds = getRegionBounds('Marmara', features);
    expect(bounds).toEqual([
      [39.5, 26.0],
      [42.0, 30.5],
    ]);

    expect(getRegionBounds('Tümü', features)).toBeNull();
    expect(getRegionBounds('Bilinmeyen', features)).toBeNull();
  });
});
