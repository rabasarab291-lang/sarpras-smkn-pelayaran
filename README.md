# Aplikasi Sarpras SMKN Pelayaran Kalimantan Samarinda

Aplikasi web untuk manajemen sarana dan prasarana sekolah yang lengkap dan mudah digunakan.

## 📋 Fitur Utama

- ✅ Manajemen Inventaris Barang
- ✅ Pencatatan Pemeliharaan dan Perbaikan
- ✅ Manajemen Peminjaman Barang
- ✅ Laporan Kondisi Barang
- ✅ Manajemen User dan Hak Akses
- ✅ Dashboard Analytics
- ✅ Export ke PDF dan Excel
- ✅ Notifikasi dan Alert

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- SQLite3
- JWT untuk Authentication
- Sequelize ORM

**Frontend:**
- React.js
- Tailwind CSS
- Axios
- React Router

## 📦 Instalasi

### Clone Repository
```bash
git clone https://github.com/rabasarab291-lang/sarpras-smkn-pelayaran.git
cd sarpras-smkn-pelayaran
```

### Install Dependencies
```bash
npm install
cd client && npm install && cd ..
```

### Setup Environment
```bash
cp .env.example .env
```

### Development
```bash
npm run dev
```

Aplikasi akan berjalan di:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## 📁 Struktur Project

```
sarpras-smkn-pelayaran/
├── server/                 # Backend Express.js
│   ├── config/             # Konfigurasi database
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── middleware/         # Middleware auth, validation
│   └── index.js            # Entry point
├── client/                 # Frontend React.js
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # Context API
│   │   └── App.jsx         # Main component
│   └── package.json
├── .env.example            # Environment template
├── package.json            # Project dependencies
└── README.md               # Documentation
```

## 🔐 Keamanan

- Authentication dengan JWT
- Password hashing dengan bcryptjs
- CORS protection
- Input validation
- Role-based access control

## 📝 Lisensi

MIT License - Bebas digunakan untuk keperluan sekolah

## 👥 Kontribusi

Bagian dari proyek SMKN Pelayaran Kalimantan Samarinda.

## 📧 Kontak

untuk pertanyaan dan dukungan, silakan hubungi pihak sekolah.
