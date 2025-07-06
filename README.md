# 🎯 SPK MAUT - Sistem Pendukung Keputusan Universal

<div align="center">

![SPK MAUT](https://img.shields.io/badge/SPK-MAUT-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-FastAPI-green?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-Vite-cyan?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-purple?style=for-the-badge&logo=tailwindcss)
![JWT](https://img.shields.io/badge/JWT-Auth-orange?style=for-the-badge&logo=jsonwebtokens)

**Sistem Pendukung Keputusan Universal menggunakan Multi-Attribute Utility Theory dengan Authentication System dan Custom Value Ranges.**

</div>

---

## 📋 Deskripsi Proyek

Aplikasi web modern yang mengimplementasikan metode **MAUT (Multi-Attribute Utility Theory)** untuk berbagai jenis pengambilan keputusan. Sistem ini dilengkapi dengan **authentication system**, **custom value ranges**, dan **freemium model** yang memungkinkan guest user mencoba fitur terbatas.

### ✨ Fitur Utama

- 🔐 **Authentication System** - Login/Register dengan JWT token
- 🎨 **Modern UI/UX** - Interface premium dengan glassmorphism effects
- 📊 **Universal SPK** - Rentang nilai yang dapat dikustomisasi (1-5, 1-10, 1-100, decimal)
- ⚙️ **Flexible Criteria** - Kelola kriteria dengan min/max values dan tipe data
- 📈 **Real-time Calculation** - Perhitungan MAUT dengan validasi input
- 🔒 **Freemium Model** - Guest dapat kalkulasi, hasil di-blur tanpa login
- 💾 **Protected History** - Riwayat kalkulasi hanya untuk user yang login
- 👑 **Admin Panel** - User management untuk administrator

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="50%">

### 🔧 Backend
- **Python 3.8+**
- **FastAPI** - Modern web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **JWT Authentication** - Secure token-based auth
- **SQLite Database** - Local data storage
- **Password Hashing** - SHA256 security
- **CORS Middleware** - Cross-origin support

</td>
<td align="center" width="50%">

### 💻 Frontend
- **React 18** - UI Library with Hooks
- **Vite** - Lightning fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management for auth
- **Local Storage** - Token persistence
- **Responsive Design** - Mobile-first approach
- **Glassmorphism UI** - Modern design effects

</td>
</tr>
</table>

---

## 📊 Kriteria Penilaian MAUT

| No. | Kriteria Penilaian                 | Tipe Kriteria | Skala Pengukuran   | Rentang Nilai           | Bobot Awal (Wi) |
| --- | ---------------------------------- | ------------- | ------------------ | ----------------------- | --------------- |
| 1   | Indeks Prestasi Kumulatif (IPK)    | Benefit       | Numerik            | 0 – 4.0                 | 0.18            |
| 2   | Pengalaman Kepengurusan Organisasi | Benefit       | Ordinal (1–5)      | 1 (rendah) – 5 (tinggi) | 0.20            |
| 3   | Kemampuan Komunikasi               | Benefit       | Kualitatif (0–100) | 0 – 100                 | 0.12            |
| 4   | Visi & Misi serta Program Kerja    | Benefit       | Kualitatif (0–100) | 0 – 100                 | 0.15            |
| 5   | Inisiatif & Proaktivitas           | Benefit       | Kualitatif (0–100) | 0 – 100                 | 0.10            |
| 6   | Kemampuan Penyelesaian Konflik     | Benefit       | Kualitatif (0–100) | 0 – 100                 | 0.10            |
| 7   | **Jumlah Ketidakhadiran**          | **Cost**      | Numerik            | 0 – tak terbatas (hari) | 0.10            |
| 8   | **Lama Masa Studi**                | **Cost**      | Numerik            | 3.5 – 7.0 (tahun)       | 0.05            |
|     | **Total**                          |               |                    |                         | **1.00**        |

---

## 🔐 Authentication System

### 👤 User Roles & Access

| Role | Dashboard | Kalkulasi | Hasil | History | Criteria | Admin |
|------|-----------|-----------|-------|---------|----------|-------|
| **Guest** | ✅ | ✅ | ❌ (Blur) | ❌ (Blur) | ✅ | ❌ |
| **User** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 🎯 Freemium Model
- **Guest Users**: Dapat melakukan kalkulasi, hasil di-blur dengan overlay login
- **Registered Users**: Akses penuh ke semua fitur, history tersimpan
- **Admin Users**: User management dan kontrol sistem

---

## 🚀 Cara Menjalankan Proyek

### 📋 Prerequisites

Pastikan Anda telah menginstall:
- **Python 3.8+**
- **Node.js 16+**
- **npm** atau **yarn**

### 1️⃣ Clone Repository

```bash
git clone https://github.com/WiMProject/spkmaut.git
cd spkmaut
```

### 2️⃣ Setup Backend (FastAPI)

```bash
# Masuk ke direktori backend
cd backend

# Buat virtual environment
python -m venv venv

# Aktivasi virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Jalankan server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend akan berjalan di: `http://localhost:8000`

### 3️⃣ Setup Frontend (React + Vite)

```bash
# Buka terminal baru dan masuk ke direktori frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

### 4️⃣ Akses Aplikasi

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Default Admin**: admin@spkmaut.com / admin123

---

## 🌟 Universal SPK Features

### 🎛️ Custom Value Ranges
- **Flexible Min/Max**: Set custom ranges (1-5, 1-10, 0-100, etc.)
- **Decimal Support**: Enable/disable decimal values per criteria
- **Dynamic Validation**: Input validation based on custom ranges
- **Visual Feedback**: Progress bars adapted to custom ranges

### 📊 Criteria Management
- **Benefit/Cost Types**: Support for both benefit and cost criteria
- **Weight Distribution**: Visual weight management with progress bars
- **Real-time Preview**: Instant feedback on criteria changes
- **Export/Import**: Save and load criteria configurations

---

## 📊 API Endpoints

### 🔗 Backend Endpoints

| Method | Endpoint | Auth Required | Deskripsi |
|--------|----------|---------------|-----------|
| `GET` | `/` | ❌ | Health check |
| `POST` | `/api/maut` | ❌ | Kalkulasi MAUT |
| `GET` | `/api/criteria` | ❌ | Get kriteria |
| `PUT` | `/api/criteria` | ❌ | Update kriteria |
| `GET` | `/api/history` | ✅ | Get riwayat |
| `DELETE` | `/api/history/{id}` | ✅ | Hapus riwayat |
| `POST` | `/api/auth/register` | ❌ | User registration |
| `POST` | `/api/auth/login` | ❌ | User login |
| `GET` | `/api/auth/me` | ✅ | Get current user |
| `GET` | `/api/admin/users` | ✅ (Admin) | Get all users |

### 📥 Contoh Request

```json
{
  "candidate": [
    {
      "name": "Kandidat A",
      "scores": [3.75, 4, 80, 90, 85, 80, 2, 4]
    },
    {
      "name": "Kandidat B", 
      "scores": [3.5, 5, 70, 85, 90, 75, 1, 3.5]
    }
  ],
  "title": "Pemilihan Ketua BEM 2024"
}
```

### 📤 Contoh Response

```json
{
  "result": [
    {
      "name": "Kandidat B",
      "score": 0.8931
    },
    {
      "name": "Kandidat A", 
      "score": 0.8647
    }
  ]
}
```

---

## 🎨 Premium UI/UX

### ✨ Modern Design
- **Glassmorphism Effects** - Premium glass-like elements
- **Gradient Themes** - Blue-purple color schemes
- **Blur Overlays** - Freemium model implementation
- **Smooth Animations** - 60fps transitions

### 🎯 Enhanced UX
- **Collapsible Sidebar** - Space-efficient navigation
- **Auth Integration** - Seamless login/register flow
- **Toast Notifications** - Real-time user feedback
- **Loading States** - Professional loading indicators

### 📱 Responsive Design
- **Mobile First** - Touch-optimized interface
- **Tablet Support** - Adaptive layouts
- **Desktop Enhanced** - Full-featured experience

---

## 🔧 Development

### 📁 Struktur Proyek

```
SPK_MAUT/
├── backend/
│   ├── app.py              # FastAPI main application
│   ├── auth.py             # Authentication logic
│   ├── database.py         # Database operations
│   ├── maut.py             # MAUT calculation engine
│   ├── requirements.txt    # Python dependencies
│   └── spk_maut.db         # SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth)
│   │   ├── App.jsx         # Main application
│   │   └── index.css       # Tailwind styles
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Vite configuration
├── .gitignore              # Git ignore rules
└── README.md               # Documentation
```

### 🛠️ Build untuk Production

```bash
# Frontend build
cd frontend
npm run build

# Backend dengan Gunicorn
cd backend
pip install gunicorn
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

## 🚀 Demo Accounts

### 👑 Administrator
- **Email**: admin@spkmaut.com
- **Password**: admin123
- **Access**: Full system access + user management

### 👤 Test User
- **Register**: Create your own account
- **Features**: Full access to all user features
- **Data**: Personal history and calculations

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. **Fork** repository ini
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan **tugas kuliah** dan **pembelajaran**. 
Bebas digunakan untuk tujuan **edukasi** dan **pengembangan**.

---

## 👨‍💻 Author

**Dibuat dengan ❤️ untuk pembelajaran SPK Universal dan implementasi Authentication System**

<div align="center">

### 🌟 Jika proyek ini membantu, berikan ⭐ ya!

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-💚-green?style=for-the-badge)
![University Project](https://img.shields.io/badge/University-Project-blue?style=for-the-badge)

**Repository**: https://github.com/WiMProject/spkmaut

</div>