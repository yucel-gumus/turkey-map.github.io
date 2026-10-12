import React from 'react';

const FooterBadge = () => {
  return (
    <footer className="app-footer-badge">
      <div className="badge-content">
        <span className="badge-tech">React 18 &bull; Leaflet &bull; GeoJSON &bull; Proj4</span>
        <span className="badge-divider">|</span>
        <span className="badge-author">
          Geliştirici:{' '}
          <a
            href="https://www.yucelgumus.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="author-link"
          >
            Yücel Gümüş
          </a>
        </span>
      </div>
    </footer>
  );
};

export default FooterBadge;
