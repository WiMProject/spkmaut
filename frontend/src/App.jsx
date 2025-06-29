import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import MAUTInfo from "./components/MAUTInfo";
import About from "./components/About";
import LoadingSpinner from "./components/LoadingSpinner";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import FloatingElements from "./components/FloatingElements";
import ProgressBar from "./components/ProgressBar";

function App() {
  const [criteria, setCriteria] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [result, setResult] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, type: '' });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchCriteria();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (criteria.length > 0 && candidates.length === 0) {
      setCandidates([
        { name: "", scores: Array(criteria.length).fill("") },
        { name: "", scores: Array(criteria.length).fill("") },
        { name: "", scores: Array(criteria.length).fill("") },
        { name: "", scores: Array(criteria.length).fill("") }
      ]);
    }
  }, [criteria]);

  const fetchCriteria = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/criteria");
      const data = await res.json();
      setCriteria(data.criteria);
    } catch (e) {
      console.error("Error fetching criteria:", e);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/history");
      const data = await res.json();
      setHistory(data.history);
    } catch (e) {
      console.error("Error fetching history:", e);
    }
  };

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
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/maut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          candidate: candidates,
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

  const handleCriteriaChange = (i, field, value) => {
    const updated = [...criteria];
    updated[i][field] = field === "weight" ? parseFloat(value) : value;
    setCriteria(updated);
  };

  const saveCriteria = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:8000/api/criteria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(criteria),
      });
      showToast('Kriteria berhasil disimpan!', 'success');
    } catch (e) {
      showToast('Gagal menyimpan kriteria', 'error');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addCriteria = () => {
    setCriteria([...criteria, { name: "", weight: 0.1, type: "benefit" }]);
  };

  const removeCriteria = (index) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const deleteHistory = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/history/${id}`, {
        method: "DELETE"
      });
      fetchHistory();
      showToast('Riwayat berhasil dihapus', 'success');
    } catch (e) {
      showToast('Gagal menghapus riwayat', 'error');
      console.error("Error deleting history:", e);
    }
  };

  const showToast = (message, type) => {
    setToast({ isVisible: true, message, type });
  };

  const confirmDelete = (id, type) => {
    setDeleteModal({ isOpen: true, id, type });
  };

  const handleDelete = () => {
    if (deleteModal.type === 'history') {
      deleteHistory(deleteModal.id);
    } else if (deleteModal.type === 'criteria') {
      removeCriteria(deleteModal.id);
    }
    setDeleteModal({ isOpen: false, id: null, type: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative flex">
      <FloatingElements />
      
      {/* Premium Curved Sidebar */}
      <div className={`${sidebarOpen ? 'w-70' : 'w-33'} transition-all duration-500 ease-in-out relative z-20 flex flex-col rounded-r-3xl overflow-hidden`}>
        {/* Curved Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/95 via-indigo-700/95 to-purple-800/95 backdrop-blur-2xl rounded-r-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 rounded-r-3xl"></div>
          {/* Floating Orbs */}
          <div className="absolute top-10 right-6 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-12 w-12 h-12 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 right-8 w-16 h-16 bg-white/5 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

      {/* Toggle Button - Outside Sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed ${sidebarOpen ? 'left-66' : 'left-29'} top-8 w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 z-40 border-3 border-white/50 hover:scale-110 hover:-translate-y-1`}
      >
        <span className="text-xl font-bold text-white drop-shadow-lg">{sidebarOpen ? '‹' : '›'}</span>
      </button>

        {/* Elegant Header */}
        <div className="relative p-8">
          <div className={`flex items-center ${sidebarOpen ? 'space-x-5' : 'justify-center'}`}>
            <div className="relative group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                <span className="text-3xl drop-shadow-lg">🎯</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-3 border-white animate-pulse shadow-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white animate-bounce"></div>
            </div>
            {sidebarOpen && (
              <div className="animate-slideUp">
                <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">SPK MAUT</h1>
                <p className="text-blue-200 text-sm font-medium mt-1 drop-shadow-sm">Decision Support System</p>
                <div className="flex items-center space-x-2 mt-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-sm"></div>
                  <span className="text-xs text-blue-200 font-medium">Online & Ready</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Curved Navigation */}
        <nav className="flex-1 px-4 space-y-4">
          {[
            { id: "home", label: "Dashboard", icon: "🏠", color: "from-blue-400 to-indigo-500", desc: "Beranda utama" },
            { id: "calculate", label: "Kalkulasi", icon: "🧮", color: "from-indigo-400 to-purple-500", desc: "Hitung MAUT" },
            { id: "criteria", label: "Kriteria", icon: "⚙️", color: "from-purple-400 to-pink-500", desc: "Pengaturan" },
            { id: "history", label: "Riwayat", icon: "📊", color: "from-blue-500 to-indigo-600", desc: "Data historis" },
            { id: "about", label: "Tentang", icon: "ℹ️", color: "from-indigo-500 to-purple-600", desc: "Informasi" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full group relative overflow-hidden ${sidebarOpen ? 'rounded-2xl' : 'rounded-xl'} transition-all duration-300 transform hover:scale-[1.02] ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-xl shadow-blue-500/20 border border-white/20`
                  : "text-gray-800 bg-white/90 hover:bg-white hover:text-gray-900 backdrop-blur-sm border border-white/20 hover:border-white/40"
              }`}
              title={!sidebarOpen ? tab.label : ''}
            >
              <div className={`flex items-center ${sidebarOpen ? 'space-x-5 py-4 px-5' : 'justify-center py-4'}`}>
                <div className={`${sidebarOpen ? 'w-12 h-12 rounded-2xl' : 'w-16 h-16 rounded-xl'} flex items-center justify-center transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-white/20 backdrop-blur-sm shadow-lg border border-white/30' 
                    : 'bg-white/10 group-hover:bg-white/20 group-hover:shadow-md border border-white/20'
                }`}>
                  <span className={`${sidebarOpen ? 'text-xl' : 'text-3xl'} drop-shadow-sm`}>{tab.icon}</span>
                </div>
                {sidebarOpen && (
                  <div className="flex-1 text-left">
                    <div className="font-bold text-base drop-shadow-sm">{tab.label}</div>
                    <div className={`text-xs transition-colors drop-shadow-sm ${
                      activeTab === tab.id ? 'text-white/90' : 'text-white/60 group-hover:text-white/80'
                    }`}>{tab.desc}</div>
                  </div>
                )}
                {activeTab === tab.id && sidebarOpen && (
                  <div className="flex flex-col space-y-1">
                    <div className="w-1 h-8 bg-white rounded-full shadow-lg animate-pulse"></div>
                    <div className="w-1 h-3 bg-white/60 rounded-full"></div>
                  </div>
                )}
              </div>
              {/* Hover Shimmer Effect */}
              {activeTab !== tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%]"></div>
              )}
            </button>
          ))}
        </nav>
        
        {/* Elegant Footer */}
        {sidebarOpen && (
          <div className="p-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-xl">
              <div className="text-center">
                <div className="text-2xl mb-3 animate-bounce-slow drop-shadow-lg">✨</div>
                <div className="text-sm font-bold text-white drop-shadow-sm">Modern Analytics With Ai MAUT Algorithm</div>
                <div className="text-xs text-white/80 mt-1 drop-shadow-sm">Powered by Six A Six Company</div>
                <div className="mt-4 flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-sm"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-sm" style={{animationDelay: '0.3s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-sm" style={{animationDelay: '0.6s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        <div className="h-full bg-white/90 backdrop-blur-sm shadow-xl border border-white/30 rounded-l-3xl overflow-hidden">
          <div className="p-8 h-full overflow-y-auto">
            
            {/* Tab Beranda */}
            {activeTab === "home" && (
              <div className="space-y-12 max-w-7xl mx-auto">
                <Hero />
                <MAUTInfo />
              </div>
            )}

            {/* Tab Kalkulasi */}
            {activeTab === "calculate" && (
              <div className="space-y-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-4 rounded-2xl border border-blue-200/50">
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
                        className="w-255 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                                className="w-full max-w-md p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                value={c.name}
                                onChange={(e) => handleChange(i, "name", e.target.value)}
                              />
                            </div>
                          </div>
                          {candidates.length > 1 && (
                            <button
                              onClick={() => handleRemoveCandidate(i)}
                              className="w-13 p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 self-start md:self-center"
                            >
                              x
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {criteria.map((k, j) => (
                            <div key={j} className="space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-700">{k.name}</label>
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                  k.type === "benefit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                  {(k.weight * 100).toFixed(0)}%
                                </span>
                              </div>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center"
                                value={c.scores[j]}
                                onChange={(e) => handleChange(i, j, e.target.value)}
                              />
                              {c.scores[j] && (
                                <ProgressBar value={c.scores[j]} max={k.type === "benefit" ? 100 : 10} color="blue" />
                              )}
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
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-10 border-2 border-blue-200/50 shadow-xl">
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
            )}

            {/* Tab Setting Kriteria */}
            {activeTab === "criteria" && (
              <div className="space-y-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-4 rounded-2xl border border-purple-200/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">⚙️</span>
                    </div>
                    <div className="text-left">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Setting Kriteria</h1>
                      <p className="text-gray-600 text-sm">Kelola kriteria penilaian dan bobot evaluasi</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                  <button
                    onClick={addCriteria}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold"
                  >
                    + Tambah Kriteria
                  </button>
                  <button
                    onClick={saveCriteria}
                    disabled={loading}
                    className="px-10 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-semibold disabled:opacity-50"
                  >
                    {loading ? "Menyimpan..." : "💾 Simpan"}
                  </button>
                </div>

                {/* Criteria Cards */}
                <div className="space-y-8">
                  {criteria.map((c, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-purple-200/50 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-purple-200/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                              {i + 1}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Kriteria {i + 1}</h3>
                          </div>
                          <button
                            onClick={() => confirmDelete(i, 'criteria')}
                            className="w-13 p-4 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            x
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Nama Kriteria</label>
                            <input
                              type="text"
                              placeholder="Nama kriteria"
                              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              value={c.name}
                              onChange={(e) => handleCriteriaChange(i, "name", e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Bobot (0-1)</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="1"
                              placeholder="0.00"
                              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center"
                              value={c.weight}
                              onChange={(e) => handleCriteriaChange(i, "weight", e.target.value)}
                            />
                            <div className="mt-3">
                              <ProgressBar value={c.weight * 100} max={100} color="purple" />
                              <div className="text-center text-sm font-semibold text-purple-600 mt-1">
                                {(c.weight * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Tipe Kriteria</label>
                            <select
                              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                              value={c.type}
                              onChange={(e) => handleCriteriaChange(i, "type", e.target.value)}
                            >
                              <option value="benefit">📈 Benefit</option>
                              <option value="cost">📉 Cost</option>
                            </select>
                            <div className="mt-3 text-center">
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                c.type === "benefit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}>
                                {c.type === "benefit" ? "Benefit" : "Cost"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Summary */}
                {criteria.length > 0 && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200/50">
                    <h3 className="font-bold text-amber-800 mb-6 text-center text-xl">📊 Ringkasan Kriteria</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{criteria.length}</div>
                        <div className="text-sm text-gray-600 font-semibold">Total</div>
                      </div>
                      <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                        <div className={`text-2xl font-bold ${
                          Math.abs(criteria.reduce((sum, c) => sum + c.weight, 0) - 1) < 0.01 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(criteria.reduce((sum, c) => sum + c.weight, 0)).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">Bobot</div>
                      </div>
                      <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                        <div className="text-2xl font-bold text-green-600">
                          {criteria.filter(c => c.type === 'benefit').length}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">Benefit</div>
                      </div>
                      <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                        <div className="text-2xl font-bold text-red-600">
                          {criteria.filter(c => c.type === 'cost').length}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">Cost</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Riwayat */}
            {activeTab === "history" && (
              <div className="space-y-10 max-w-7xl mx-auto">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-indigo-50 to-blue-50 px-8 py-4 rounded-2xl border border-indigo-200/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">📊</span>
                    </div>
                    <div className="text-left">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Riwayat Kalkulasi</h1>
                      <p className="text-gray-600 text-sm">Lihat hasil perhitungan MAUT sebelumnya</p>
                    </div>
                  </div>
                </div>
                
                {history.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-xl font-semibold">Belum ada riwayat kalkulasi</p>
                    <p className="text-gray-400 mt-2">Mulai dengan melakukan kalkulasi MAUT pertama</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {history.map((h, i) => (
                      <div key={i} className="bg-white border border-indigo-200/50 rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-8">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                            <div className="flex-1">
                              <h3 className="font-bold text-xl text-gray-800 mb-2">{h.title}</h3>
                              <p className="text-gray-500 text-sm">🕒 {new Date(h.created_at).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                                👥 {h.candidates.length} kandidat
                              </span>
                              <button
                                onClick={() => confirmDelete(h.id, 'history')}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-6">
                            <h4 className="font-bold text-gray-700 mb-4">🏆 Top 3 Hasil:</h4>
                            <div className="space-y-3">
                              {h.results.slice(0, 3).map((r, j) => (
                                <div key={j} className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                      j === 0 ? 'bg-yellow-500 text-white' :
                                      j === 1 ? 'bg-gray-400 text-white' :
                                      'bg-orange-500 text-white'
                                    }`}>
                                      {j + 1}
                                    </div>
                                    <span className="font-semibold">{r.name}</span>
                                  </div>
                                  <span className="font-bold text-blue-600">{r.score}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab About */}
            {activeTab === "about" && (
              <div className="max-w-7xl mx-auto">
                <About />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal & Toast */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, type: '' })}
        title="Konfirmasi Hapus"
      >
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus {deleteModal.type === 'history' ? 'riwayat' : 'kriteria'} ini?
        </p>
        <div className="flex space-x-3 justify-end">
          <button
            onClick={() => setDeleteModal({ isOpen: false, id: null, type: '' })}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Hapus
          </button>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}

export default App;