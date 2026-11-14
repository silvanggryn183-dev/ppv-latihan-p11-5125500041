# Changelog

Semua perubahan penting pada Catatan Kuliah dicatat di sini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [1.2.0] - 2026-11-14
### Added
- `src/komponen.js` berisi komponen `KartuCatatan(catatan)` dan `PesanKosong(teks)`.
- `KartuCatatan` dipakai di daftar Disematkan dan Semua catatan, sehingga markup kartu hanya ditulis sekali.
- `KUNCI` berversi (`catatan-kuliah:v1`) dan cadangan di memori pada `src/storage.js`.
- Peringatan di halaman bila penyimpanan tidak tersedia.
- Pemeriksa `uji/uji-tangguh.html` dan `uji/uji-tangguh.js`.

### Changed
- `ui.js` membangun elemen dengan `createElement` dan `textContent`, bukan `innerHTML`.
- Kunci penyimpanan berganti dari `catatan-kuliah` ke `catatan-kuliah:v1`. Data lama tidak dimigrasikan.

### Fixed
- Aplikasi tidak lagi mati saat isi penyimpanan rusak (JSON tidak valid, bukan array, atau item tidak sah).
- Judul seperti `<b>tebal</b>` tampil sebagai teks dan tidak lagi dibaca sebagai HTML.

## [1.1.0] - 2026-11-14
### Changed
- Kode monolit dipecah menjadi modul ES: `storage.js` (baca-tulis), `state.js` (data dan aturan), `ui.js` (tampilan), dan `main.js` (titik masuk).
- Event dipasang dari JavaScript dengan delegasi event, tanpa atribut `onclick`.
- Variabel global dihilangkan.

## [1.0.0] - 2026-11-14
### Added
- Versi monolit awal Catatan Kuliah: tambah, cari, sematkan, dan hapus catatan, dengan penyimpanan di localStorage.