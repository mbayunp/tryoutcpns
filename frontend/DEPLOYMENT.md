# Panduan Deployment Sentral CPNS

Dokumen ini menjelaskan cara menjalankan aplikasi secara lokal dan melakukan deployment untuk Frontend dan Backend ke production.

## 1. Menjalankan secara Lokal (Local Development)

### Persiapan
Pastikan Node.js telah terinstal di komputer Anda.

### Menjalankan Backend
1. Masuk ke folder backend: `cd backend`
2. Instal dependensi: `npm install`
3. Konfigurasi database/environment di file `.env` (jika ada).
4. Jalankan server backend: `npm run dev` (berjalan di `http://localhost:5000` secara default).

### Menjalankan Frontend
1. Masuk ke folder frontend: `cd frontend`
2. Instal dependensi: `npm install`
3. Pastikan konfigurasi lokal ada di file `.env.development` (atau file `.env`):
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```
4. Jalankan aplikasi frontend: `npm start` (berjalan di `http://localhost:3000` secara default).

---

## 2. Deploy Frontend (Vercel / Netlify / Cloudflare Pages)

Saat melakukan deployment frontend ke platform hosting statis seperti Vercel atau Netlify:

1. **Build Command**: `npm run build`
2. **Publish Directory**: `build`
3. **Environment Variables**:
   Tambahkan variabel lingkungan berikut di dashboard platform hosting Anda:
   * **Key**: `REACT_APP_API_URL`
   * **Value**: `https://api.domainanda.com` (Ubah ke URL produksi backend Anda yang sudah live).

> [!NOTE]
> Karena menggunakan Create React App, environment variables dibundel saat proses kompilasi (build-time). Setiap perubahan nilai variabel lingkungan mengharuskan Anda melakukan build ulang (redeploy).

---

## 3. Deploy Backend (VPS / Render / Railway)

Saat melakukan deployment backend:

1. **Jalankan Instalasi**: `npm install`
2. **Start Command**: `npm start` atau `node server.js`
3. **Environment Variables**:
   Pastikan variabel lingkungan berikut disesuaikan di server backend Anda:
   * `PORT`: Port backend (contoh: `5000` atau default `process.env.PORT` dari platform).
   * `DATABASE_URL` / Kredensial DB: Kredensial koneksi ke PostgreSQL/MySQL (sesuai konfigurasi backend).
   * `JWT_SECRET`: Kunci rahasia enkripsi token JWT.
   * `CORS_ORIGIN`: Atur CORS agar mengizinkan request dari domain Frontend Anda (misal: `https://domainanda.com`).
