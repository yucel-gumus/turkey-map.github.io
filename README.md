# Türkiye İnteraktif Harita Uygulaması

Bu proje, React ve Leaflet kullanılarak oluşturulmuş interaktif bir Türkiye haritası uygulamasıdır. Harita üzerinde Türkiye'nin şehirleri gösterilir ve tıklanan şehir vurgulanarak ismi bir popup içinde belirtilir.

## Özellikler

*   Türkiye'nin şehirlerini gösteren interaktif harita.
*   Harita üzerinde kaydırma ve yakınlaştırma/uzaklaştırma.
*   Şehirlere tıklandığında sarı renkle vurgulama.
*   Tıklanan şehrin ismini gösteren popup.
*   Varsayılan şehir rengi gridir.

## Kullanılan Teknolojiler

*   [React](https://reactjs.org/)
*   [react-leaflet](https://react-leaflet.js.org/)
*   [Leaflet](https://leafletjs.com/)
*   [Create React App](https://create-react-app.dev/)

## Kurulum ve Çalıştırma

1.  **Projeyi Klonlayın:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Uygulamayı Başlatın:**
    ```bash
    npm start
    ```
    Uygulama varsayılan olarak `http://localhost:3000` adresinde açılacaktır.

## Veri Kaynağı

*   Şehirlerin coğrafi sınır verileri `src/tr-cities.json` dosyasından alınmaktadır.

## Harita Katmanı (Tile Layer)

*   Uygulama, harita altlığı olarak `public/map.png` dosyasını kullanacak şekilde ayarlanmıştır. Bu dosyanın projede `public` klasörü altında bulunduğundan emin olun. Eğer bu dosya mevcut değilse, harita altlığı boş görünecektir. Alternatif olarak, `src/App.js` dosyasındaki `TileLayer` bileşeninin `url` prop'unu OpenStreetMap gibi bir harita sağlayıcısıyla (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) değiştirebilirsiniz.

## Build ve Deployment

*   **Build:** Uygulamanın üretim sürümünü oluşturmak için:
    ```bash
    npm run build
    ```
*   **Deployment (GitHub Pages):** Proje GitHub Pages'e deploy edilecek şekilde yapılandırılmıştır:
    ```bash
    npm run deploy
    ```

## Canlı Demo

Uygulamanın canlı demosuna [buradan](https://yucel-gumus.github.io/turkey-map.github.io/) ulaşabilirsiniz. (Not: Bu link `package.json` dosyasından alınmıştır, güncel olmayabilir veya harita katmanı sorunu nedeniyle düzgün çalışmayabilir.)