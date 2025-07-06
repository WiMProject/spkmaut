import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ProgressBar from "../components/ProgressBar";
import BlurOverlay from "../components/BlurOverlay";

function CalculatePage({ criteria, candidates, setCandidates, title, setTitle, result, setResult, loading, setLoading, showToast, fetchHistory, isLoggedIn, onLoginClick }) {
  
  const handleAddCandidate = () => {
    setCandidates([
      ...candidates,
      { name: "", scores: Array(criteria.length).fill("") },
    ]);
  };

  const handleRemoveCandidate = (index) => {
    setCandidates(candidates.filter((_, i) => i !== index));
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
    const validCandidates = candidates.filter(c => 
      c.name.trim() !== '' && c.scores.some(score => score !== '' && score !== 0)
    );

    if (validCandidates.length === 0) {
      showToast('Data belum diisi! Harap isi minimal 1 kandidat dengan nama dan nilai.', 'error');
      return;
    }

    const incompleteCandidate = validCandidates.find(c => 
      c.scores.some(score => score === '' || score === null || score === undefined)
    );

    if (incompleteCandidate) {
      showToast(`Data belum lengkap! Kandidat "${incompleteCandidate.name}" masih ada nilai yang kosong.`, 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/maut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          candidate: validCandidates,
          title: title || "Kalkulasi MAUT"
        }),
      });
      const data = await res.json();
      setResult(data.result);
      fetchHistory();
      showToast('Kalkulasi berhasil!', 'success');
    } catch (e) {
      showToast('Gagal terhubung ke backend', 'error');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-250 items-center space-x-4 bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-4 rounded-2xl border border-blue-200/50">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🧮</span>
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Kalkulasi MAUT</h1>
            <p className="text-gray-600 text-sm">Evaluasi kandidat dengan Multi-Attribute Utility Theory</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl border border-blue-200/50 p-8 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Judul Kalkulasi</label>
            <input
              type="text"
              placeholder="Masukkan judul untuk sesi kalkulasi..."
              className="w-250 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <button
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg"
            onClick={handleAddCandidate}
          >
            + Kandidat
          </button>
        </div>
      </div>

      {/* Candidates */}
      <div className="space-y-8">
        {candidates.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-blue-200/50 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-blue-200/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Kandidat</label>
                    <input
                      type="text"
                      placeholder={`Kandidat ${i + 1}`}
                      className="w-100 max-w-md p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={c.name}
                      onChange={(e) => handleChange(i, "name", e.target.value)}
                    />
                  </div>
                </div>
                {candidates.length > 1 && (
                  <button
                    onClick={() => handleRemoveCandidate(i)}
                    className="p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {criteria.map((k, j) => (
                  <div key={j} className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700">{k.name}</label>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          k.type === "benefit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {(k.weight * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-center mb-2">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          Rentang: {k.min_value || 0} - {k.max_value || 100} {k.decimal ? "(Desimal)" : "(Bulat)"}
                        </span>
                      </div>
                      <input
                        type="number"
                        step={k.decimal ? "0.1" : "1"}
                        min={k.min_value || 0}
                        max={k.max_value || 100}
                        placeholder={`${k.min_value || 0} - ${k.max_value || 100}`}
                        className="w-85 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center font-medium"
                        value={c.scores[j]}
                        onChange={(e) => handleChange(i, j, e.target.value)}
                      />
                      {c.scores[j] && (
                        <div className="space-y-2">
                          <ProgressBar value={c.scores[j]} max={k.max_value || 100} color="blue" />
                          <div className="text-xs text-gray-500 text-center font-medium">
                            {((c.scores[j] / (k.max_value || 100)) * 100).toFixed(1)}% dari maksimal
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calculate Button */}
      {candidates.length > 0 && (
        <div className="text-center py-8">
          <button
            className="px-16 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-xl disabled:opacity-50"
            onClick={handleCalculate}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-3">
                <LoadingSpinner size="sm" />
                <span>Menghitung...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <span>🚀</span>
                <span>Hitung MAUT</span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {result.length > 0 && (
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-10 border-2 border-blue-200/50 shadow-xl">
          {!isLoggedIn && <BlurOverlay onLoginClick={onLoginClick} />}
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">🏆 Hasil Perhitungan</h2>
          </div>
          <div className="space-y-6">
            {result.map((r, i) => (
              <div key={i} className={`p-6 rounded-xl border-2 ${
                i === 0 ? "bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-400" : "bg-white border-gray-200"
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                      i === 0 ? "bg-yellow-500 text-white" : "bg-gray-500 text-white"
                    }`}>
                      {i + 1}
                    </div>
                    <span className="font-bold text-lg">{r.name}</span>
                  </div>
                  <span className="font-bold text-2xl text-blue-600">{r.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CalculatePage;