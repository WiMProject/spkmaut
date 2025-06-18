# 📌 SPK Pemilihan Ketua Organisasi Mahasiswa - Metode MAUT

Proyek ini adalah implementasi dari Sistem Pendukung Keputusan (SPK) menggunakan metode **MAUT (Multi-Attribute Utility Theory)** untuk membantu dalam proses pemilihan Ketua Organisasi Mahasiswa secara objektif berdasarkan berbagai kriteria yang telah ditentukan.

---

## 🚀 Teknologi yang Digunakan

### 🔧 Backend

* **Python** dengan framework **FastAPI**
* Tidak menggunakan database (data dikirim langsung melalui API)

### 💻 Frontend

* **React** + **Vite**
* **Tailwind CSS** untuk styling modern dan responsif
* `npm` sebagai package manager

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

## 🔧 Cara Menjalankan Proyek

### 1. Clone Repositori

```bash
git clone https://github.com/username/spk-maut
cd spk-maut
```

### 2. Menjalankan Backend (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
```

### 3. Menjalankan Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

Pastikan backend berjalan di `http://localhost:8000` agar frontend bisa terhubung.

---

## 📥 Contoh Format Input Kandidat (Frontend)

Frontend akan mengirim data seperti berikut ke API MAUT:

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
  ]
}
```

---

## 📈 Hasil Output

Output dari API akan berupa daftar kandidat dengan skor akhir berdasarkan MAUT:

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

## 🙌 Kontribusi & Lisensi

Proyek ini dibuat untuk keperluan tugas kuliah dan dapat dikembangkan lebih lanjut.
Lisensi bebas digunakan untuk pembelajaran.

---
