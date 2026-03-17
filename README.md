# GitHub Follower Automation

Script Node.js (TypeScript) untuk otomatisasi mutlak followers GitHub.

## Fitur Utama
1. **Auto Follback** - Otomatis follow akun yang baru saja mem-follow Anda.
2. **Auto Unfollow** - Otomatis unfollow akun yang berhenti mem-follow (unfollow) Anda.
3. **Pengecualian Lama** - Follower lama Anda yang sudah ada saat script dijalankan pertama kali TIDAK akan di-follback secara otomatis (script akan menyimpan state awal).

## Prasyarat
- Node.js versi 18 atau lebih baru.
- Personal Access Token GitHub (dengan permission `user` atau minimal `read:user` dan `user:follow`).

## Cara Penggunaan

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Pengaturan Environment**
   Set up file `.env`.
   ```bash
   cp .env.example .env
   ```
   Lalu buka file `.env` dan ganti `your_personal_access_token_here` dengan Token GitHub Anda.

3. **Eksekusi Script**
   Jalankan script menggunakan perintah:
   ```bash
   npm start
   ```
   Atau Anda juga bisa melakukan build terlebih dahulu melalui `npm run build`, lalu menjalankan hasil build-nya dari folder `dist`.

## Cara Kerja Script
- Saat dijalankan **pertama kali**, script hanya akan mengambil daftar followers Anda saat ini dan menyimpannya ke `followers_db.json`. Ini berfungsi sebagai _baseline_ agar script tahu siapa saja follower lama yang tidak perlu di-follback otomatis.
- Saat dijalankan **kedua kali dan seterusnya**, script akan membandingkan follower saat ini dengan data di `followers_db.json`.
  - Jika ada *follower baru*, script akan mem-follow mereka.
  - Jika ada orang yang *unfollow* Anda, script akan meng-unfollow mereka.
  - Terakhir, `followers_db.json` akan di-update dengan data terbaru.

## Catatan
Sebaiknya Anda menjadwalkan script ini menggunakan **cron job** atau dipadankan dengan **GitHub Actions** untuk menjalankannya secara berkala (misalnya setiap hari).
