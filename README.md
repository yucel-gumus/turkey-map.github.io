# 🗺️ Türkiye İnteraktif Haritası (Interactive Turkey GIS Map)

Türkiye İnteraktif Haritası; Türkiye'nin 81 ilinin sınır poligonlarını dinamik olarak harita üzerinde çizdiren, seçilen veya üzerine gelinen ili vurgulayan ve coğrafi bilgi sistemi (CBS) özelliklerini tarayıcıya taşıyan modern bir **React + Leaflet + Proj4** web uygulamasıdır.

Uygulama, özel harita projeksiyonları ve koordinat dönüşümleri gerçekleştirebilmek amacıyla **proj4** kütüphanesini entegre etmektedir.

---

## 🌟 Öne Çıkan Özellikler

* 🇹🇷 **81 İl Poligon Çizimi (GeoJSON):** `src/tr-cities.json` dosyası içerisindeki GeoJSON koordinat verilerini okuyarak 81 ilin sınırlarını kusursuz bir şekilde vektörel katmanlar olarak çizer.
* 📍 **Dinamik İl Vurgulama (Highlight):** 
  * Fareyle üzerine gelinen veya tıklanan iller, kontrast renklerle (sarı highlight) ve özel kenarlık çizgileriyle anında vurgulanır.
  * Tıklanan ile otomatik odaklanma (zoom-in) ve o ilin bilgilerini gösteren Leaflet Popup baloncuğu açılır.
* 🌐 **proj4 ile Hassas Koordinat Dönüşümü:** CBS verileriyle çalışırken farklı projeksiyon sistemleri (EPSG:4326 WGS84'ten yerel ED50/UTM projeksiyonlarına) arasında gerçek zamanlı koordinat dönüşümleri yapılmasına olanak tanır.
* 🎨 **Özelleştirilebilir Harita Altlığı (TileLayer):** OpenStreetMap, CartoDB veya yerel olarak barındırılan özel raster harita görsellerini altlık olarak kullanabilme desteği.
* 🚀 **Tek Komutla Dağıtım (GitHub Pages):** `gh-pages` entegrasyonu ile uygulamanın derlenmesi ve GitHub Pages üzerinde yayına alınması otomatikleştirilmiştir.

---

## 🏗️ Proje Klasör Yapısı

```
turkey-map.github.io/
├── src/
│   ├── components/       # Harita bileşeni ve CBS kontrol paneli
│   ├── tr-cities.json    # 81 ilin sınır koordinatlarını barındıran GeoJSON verisi
│   ├── App.js            # Leaflet MapContainer, TileLayer ve GeoJSON katmanlarının yönetildiği ana dosya
│   └── index.js
├── public/
│   └── index.html
├── package.json          # gh-pages deploy komutları ve proj4 bağımlılığı
└── README.md
```

---

## 🚀 Kurulum ve Yerel Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
git clone https://github.com/yucel-gumus/turkey-map.github.io.git
cd turkey-map.github.io
npm install
```

### 2. Uygulamayı Başlatın
```bash
npm start
```
Uygulama `http://localhost:3000` adresinde geliştirme modunda çalışacaktır.

---

## 📦 Dağıtım (Deploy)

Projeyi derlemek ve `gh-pages` dalına yükleyerek yayına almak için:
```bash
npm run deploy
```
*Not: `package.json` dosyasındaki `homepage` alanı `https://yucel-gumus.github.io/turkey-map.github.io/` olarak yapılandırılmıştır.*

---

## 🔗 Canlı Bağlantılar
* **Canlı Demo:** [https://yucel-gumus.github.io/turkey-map.github.io/](https://yucel-gumus.github.io/turkey-map.github.io/)
* **Geliştirici LinkedIn:** [https://linkedin.com/in/yucel-gumus](https://linkedin.com/in/yucel-gumus)