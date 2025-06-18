import { useState } from "react";

const CRITERIA = [
  "IPK",
  "Pengalaman Organisasi",
  "Komunikasi",
  "Visi Misi",
  "Inisiatif",
  "Penyelesaian Konflik",
  "Ketidakhadiran",
  "Lama Studi",
];

function App() {
  const [candidates, setCandidates] = useState([]);
  const [result, setResult] = useState([]);

  const handleAddCandidate = () => {
    setCandidates([
      ...candidates,
      { name: "", scores: Array(CRITERIA.length).fill("") },
    ]);
  };

  const handleChange = (i, field, value) => {
    const updated = [...candidates];
    if (field === "name") {
      updated[i].name = value;
    } else {
      const idx = parseInt(field);
      updated[i].scores[idx] = Number(value);
    }
    setCandidates(updated);
  };

  const handleCalculate = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/maut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate: candidates }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (e) {
      alert("Gagal terhubung ke backend. Pastikan FastAPI aktif.");
      console.err (e)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">
          Sistem Pendukung Keputusan MAUT - Pemilihan Ketua
        </h1>

        <button
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleAddCandidate}
        >
          + Tambah Kandidat
        </button>

        {candidates.map((c, i) => (
          <div
            key={i}
            className="mb-6 border border-gray-300 rounded p-4 shadow-sm bg-gray-50"
          >
            <input
              type="text"
              placeholder="Nama Kandidat"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              value={c.name}
              onChange={(e) => handleChange(i, "name", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              {CRITERIA.map((k, j) => (
                <div key={j}>
                  <label className="block text-sm font-medium text-gray-700">
                    {k}
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
                    value={c.scores[j]}
                    onChange={(e) => handleChange(i, j, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {candidates.length > 0 && (
          <button
            className="w-full mt-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleCalculate}
          >
            Hitung MAUT
          </button>
        )}

        {result.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Hasil Perhitungan MAUT:
            </h2>
            <ul className="space-y-2">
              {result.map((r, i) => (
                <li
                  key={i}
                  className="p-3 bg-white rounded border border-gray-300 shadow"
                >
                  <span className="font-semibold">{r.name}</span> — Skor:{" "}
                  <span className="text-blue-600 font-bold">{r.score}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
