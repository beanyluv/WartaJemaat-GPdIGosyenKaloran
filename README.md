# GPdI Gosyen Kaloran - Warta Jemaat Digital

Portal Warta Jemaat Digital resmi untuk **Gereja Pantekosta di Indonesia (GPdI) Gosyen Kaloran**.

---

## 🌐 Tautan Akses Online (Live Deployment)

- **URL Publik**: **[https://wartajemaat-gpdigosyenkaloran.loca.lt](https://wartajemaat-gpdigosyenkaloran.loca.lt)**  
  *(Jika peramban meminta IP Tunnel pertama kali, masukkan IP: `182.8.249.190` lalu klik **Click to Continue**)*
- **URL Lokal**: **[http://localhost:8080](http://localhost:8080)**
- **PIN Akses Pengelola**: **`1234`** *(Tombol gembok di bagian paling bawah halaman)*
- **Peta Lokasi Google Maps**: **[https://maps.app.goo.gl/CNYqT17tYnc58aD1A](https://maps.app.goo.gl/CNYqT17tYnc58aD1A)**

---

## ☁️ Database Cloud (Bukan Lokal)

Agar data warta, jadwal, dokumentasi, dan renungan dapat disinkronkan secara real-time dan diakses oleh jemaat dari mana pun setelah di-deploy:

### Pilihan Rekomendasi: **Firebase Realtime Database (100% Gratis)**
1. Buka konsol Firebase: **[https://console.firebase.google.com/](https://console.firebase.google.com/)**
2. Buat proyek baru (contoh nama: `wartajemaat-gpdigosyen`).
3. Masuk ke menu **Build** > **Realtime Database** > **Create Database**.
4. Pilih lokasi (misal: *Singapore / asia-southeast1*) dan pilih **Start in Test Mode** (agar dapat dibaca dan ditulis publik).
5. Salin URL database yang muncul, contoh:
   ```
   https://wartajemaat-gpdigosyen-default-rtdb.asia-southeast1.firebasedatabase.app/data.json
   ```
6. Buka **Akses Pengelola** di portal warta > Masuk tab **Database Cloud** > Tempel URL di kolom yang disediakan > Klik **Simpan URL Cloud & Sinkronkan Sekarang**.

---

## 🌟 Fitur Baru yang Telah Diterapkan

1. **Pembersihan Foto Mentah Kolase**:
   - Saat foto-foto diunggah ke alat kolase dan tombol **"Pasang Sebagai Warta Jemaat"** diklik, sistem secara otomatis membersihkan berkas foto mentah sebelum kolase dari formulir dan memori. Hanya gambar kolase akhir beresolusi HD yang disimpan.

2. **Pembersihan Otomatis Warta Kedaluwarsa (> 30 Hari)**:
   - Setiap lembar warta jemaat memiliki penanda waktu pembuatan (*timestamp*).
   - Apabila usia warta telah melewati **30 hari**, sistem secara otomatis menghapus gambar warta kedaluwarsa tersebut dan menampilkan pemberitahuan bagi pengelola untuk mengunggah lembar warta edisi terbaru.
   - Komponen lain (jadwal ibadah, persekutuan, dokumentasi, renungan) tetap tersimpan aman dan hanya dihapus secara manual oleh pengelola gereja.

3. **Kualitas 100% HD**:
   - Generator kolase 2 kolom mempertahankan dimensi lebar piksel asli tertinggi dari foto-foto yang diunggah (*lossless PNG*), lengkap dengan fitur penampil layar penuh (*lightbox zoom*).

4. **Pembaruan Tautan Google Maps**:
   - Tombol navigasi rute diarahkan ke: `https://maps.app.goo.gl/CNYqT17tYnc58aD1A`.

---

## 📁 Struktur Berkas

- [`index.html`](file:///c:/wartajemaat/index.html): Halaman utama portal warta jemaat digital.
- [`style.css`](file:///c:/wartajemaat/style.css): Gaya visual langit surgawi, bayangan rococo, dan tab pengelola.
- [`app.js`](file:///c:/wartajemaat/app.js): Logika interaktif, kolase 2 kolom, sinkronisasi cloud database, dan timer 30 hari warta.
- [`server.py`](file:///c:/wartajemaat/server.py): Server lokal & REST API backend.
- [`database.json`](file:///c:/wartajemaat/database.json): Berkas cadangan basis data lokal.
- [`assets/`](file:///c:/wartajemaat/assets/):
  - `background.png`: Latar belakang lukisan burung merpati & bunga lili-mawar putih.
  - `gpdi-logo.png`: Logo resmi GPdI.
  - `warta-sample.png`: Poster warta jemaat HD terbaru.
