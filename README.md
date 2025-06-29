# 🎯 SPK MAUT - Sistem Pendukung Keputusan Pemilihan Ketua Organisasi

<div align="center">

![SPK MAUT](https://img.shields.io/badge/SPK-MAUT-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-FastAPI-green?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-Vite-cyan?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-purple?style=for-the-badge&logo=tailwindcss)

**Sistem Pendukung Keputusan menggunakan Multi-Attribute Utility Theory untuk pemilihan Ketua Organisasi Mahasiswa secara objektif dan terukur.**

</div>

---

## 📋 Deskripsi Proyek

Aplikasi web modern yang mengimplementasikan metode **MAUT (Multi-Attribute Utility Theory)** untuk membantu proses pengambilan keputusan dalam pemilihan Ketua Organisasi Mahasiswa. Sistem ini memberikan penilaian objektif berdasarkan kriteria yang telah ditentukan dengan interface yang user-friendly dan responsive.

### ✨ Fitur Utama

- 🎨 **Modern UI/UX** - Interface yang clean dan responsive dengan Tailwind CSS
- 📊 **Dashboard Analytics** - Visualisasi hasil perhitungan MAUT
- ⚙️ **Manajemen Kriteria** - Kelola kriteria dan bobot penilaian
- 📈 **Real-time Calculation** - Perhitungan MAUT secara real-time
- 📱 **Responsive Design** - Optimal di desktop, tablet, dan mobile
- 💾 **Riwayat Kalkulasi** - Simpan dan lihat hasil perhitungan sebelumnya

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
- **CORS Middleware** - Cross-origin support

</td>
<td align="center" width="50%">

### 💻 Frontend
- **React 18** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **JavaScript ES6+**
- **Responsive Design**

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

---

## 🎨 Fitur Tampilan

<div align="center">

### ✨ **Modern UI Features**

🏠 **Dashboard** - Hero slider dengan informasi MAUT dan navigasi intuitif  
🧮 **Kalkulasi** - Form input kandidat dengan progress indicators real-time  
⚙️ **Kriteria** - Manajemen kriteria dengan visual feedback dan validasi  
📊 **Riwayat** - History management dengan tampilan hasil yang elegant  
📱 **Responsive** - Optimal di desktop, tablet, dan mobile devices  

### 🎯 **Design Highlights**
- **Collapsible Sidebar** dengan curved design dan floating elements
- **Blue-to-Purple Gradient** theme yang konsisten
- **Glassmorphism Effects** untuk tampilan modern
- **Smooth Animations** dan micro-interactions
- **Toast Notifications** untuk user feedback

</div>

---

## 📊 API Endpoints

### 🔗 Backend Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/` | Health check |
| `POST` | `/api/maut` | Kalkulasi MAUT |
| `GET` | `/api/criteria` | Get kriteria |
| `PUT` | `/api/criteria` | Update kriteria |
| `GET` | `/api/history` | Get riwayat |
| `DELETE` | `/api/history/{id}` | Hapus riwayat |

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

## 🎨 Fitur UI/UX

### ✨ Modern Design
- **Gradient Backgrounds** - Blue to purple theme
- **Glassmorphism Effects** - Modern glass-like elements
- **Smooth Animations** - Fluid transitions dan hover effects
- **Responsive Layout** - Mobile-first design approach

### 🎯 User Experience
- **Collapsible Sidebar** - Space-efficient navigation
- **Real-time Feedback** - Instant calculation results
- **Progress Indicators** - Visual feedback untuk input
- **Toast Notifications** - User-friendly alerts

### 📱 Responsive Features
- **Mobile Optimized** - Touch-friendly interface
- **Tablet Support** - Adaptive grid layouts
- **Desktop Enhanced** - Full-featured experience

---

## 🔧 Development

### 📁 Struktur Proyek

```
SPK_MAUT/
├── backend/
│   ├── app.py              # FastAPI main application
│   ├── requirements.txt    # Python dependencies
│   └── models/            # Data models
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx       # Main application
│   │   └── index.css     # Tailwind styles
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite configuration
└── README.md
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

**Dibuat dengan ❤️ untuk pembelajaran SPK dan implementasi metode MAUT**

<div align="center">

### 🌟 Jika proyek ini membantu, berikan ⭐ ya!

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-💚-green?style=for-the-badge)

</div>