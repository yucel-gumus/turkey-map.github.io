import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock react-leaflet because v4 is ESM-only and react-scripts Jest doesn't transpile node_modules ESM
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  GeoJSON: require('react').forwardRef((props, ref) => <div ref={ref} data-testid="geojson-layer" />),
  useMap: () => ({
    flyTo: jest.fn(),
    fitBounds: jest.fn(),
  }),
}));

describe('Turkey Interactive Map App', () => {
  test('renders header with brand title', () => {
    render(<App />);
    const title = screen.getByText(/Türkiye İnteraktif Haritası/i);
    expect(title).toBeInTheDocument();
  });

  test('renders search input and region filter chips', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/İl veya Plaka ara/i);
    expect(searchInput).toBeInTheDocument();

    const marmaraChip = screen.getByRole('button', { name: /Marmara/i });
    expect(marmaraChip).toBeInTheDocument();
  });

  test('renders footer with developer attribution', () => {
    render(<App />);
    const authorLink = screen.getByText(/Yücel Gümüş/i);
    expect(authorLink).toBeInTheDocument();
    expect(authorLink.closest('a')).toHaveAttribute(
      'href',
      'https://www.yucelgumus.dev/'
    );
  });

  test('allows searching and selecting a city from autocomplete', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/İl veya Plaka ara/i);
    fireEvent.change(searchInput, { target: { value: '34' } });

    // Autocomplete list should display İstanbul
    const istanbulItem = screen.getByText(/İstanbul/i);
    expect(istanbulItem).toBeInTheDocument();

    // Clicking Istanbul selects it and shows info panel
    fireEvent.click(istanbulItem);
    expect(screen.getByText(/Marmara Bölgesi/i)).toBeInTheDocument();
  });

  test('allows switching color mode', () => {
    render(<App />);
    const colorBtn = screen.getByRole('button', { name: /Bölgesel Renk/i });
    expect(colorBtn).toBeInTheDocument();

    fireEvent.click(colorBtn);
    expect(screen.getByRole('button', { name: /Sade Renk/i })).toBeInTheDocument();
  });
});
