# Türkiye İnteraktif Harita

React + Leaflet ile **81 il** sınır poligonlarını gösteren, tıklanan ili vurgulayan ve popup ile isim gösteren GitHub Pages uygulaması.

**Canlı:** [yucel-gumus.github.io/turkey-map.github.io](https://yucel-gumus.github.io/turkey-map.github.io/)  
**GitHub:** [yucel-gumus/turkey-map.github.io](https://github.com/yucel-gumus/turkey-map.github.io)

---

## Özellikler

- `src/tr-cities.json` GeoJSON benzeri il sınırları
- Zoom / pan; tıklanınca sarı highlight + popup
- Varsayılan gri dolgu; seçili il kontrast rengi
- **proj4** ile koordinat dönüşümü (özel projeksiyon gerekiyorsa)
- `gh-pages` ile tek komut deploy

---

## Teknoloji

- Create React App (`react-scripts` 5)
- react-leaflet 4, Leaflet 1.9
- gh-pages deploy pipeline

---

## Kurulum

```bash
git clone https://github.com/yucel-gumus/turkey-map.github.io.git
cd turkey-map.github.io
npm install
npm start
```

Geliştirme: `http://localhost:3000`

---

## Harita altlığı

Proje `public/map.png` özel raster altlık kullanacak şekilde ayarlanabilir. Dosya yoksa `src/App.js` içindeki `TileLayer` URL'sini OpenStreetMap'e çevirin:

```text
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

---

## Build ve yayın

```bash
npm run build
npm run deploy    # homepage: package.json içinde tanımlı
```

`package.json` → `"homepage": "https://yucel-gumus.github.io/turkey-map.github.io/"`

---

## Veri kaynağı

İl geometrileri repoda `src/tr-cities.json`; güncelleme için kaynak shapefile/GeoJSON dışarıdan işlenip bu dosyaya yazılır.

---

## Lisans

MIT.