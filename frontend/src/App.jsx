import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import CalculatePage from "./pages/CalculatePage";
import CriteriaPage from "./pages/CriteriaPage";
import HistoryPage from "./pages/HistoryPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import FloatingElements from "./components/FloatingElements";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { user, logout, isLoggedIn, isAdmin } = useAuth();
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
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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
      const res = await fetch("/api/criteria");
      const data = await res.json();
      setCriteria(data.criteria);
    } catch (e) {
      console.error("Error fetching criteria:", e);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const res = await fetch("/api/history", {
        headers
      });
      
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history);
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.error("Error fetching history:", e);
      setHistory([]);
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
    // Filter kandidat yang memiliki nama dan minimal satu skor
    const validCandidates = candidates.filter(c => 
      c.name.trim() !== '' && c.scores.some(score => score !== '' && score !== 0)
    );

    // Validasi: minimal ada 1 kandidat valid
    if (validCandidates.length === 0) {
      showToast('Data belum diisi! Harap isi minimal 1 kandidat dengan nama dan nilai.', 'error');
      return;
    }

    // Validasi: setiap kandidat valid harus memiliki semua skor terisi
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
    setCriteria([...criteria, { name: "", weight: 0.1, type: "benefit", min_value: 0, max_value: 100, decimal: true }]);
  };

  const removeCriteria = (index) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const deleteHistory = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/history/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchHistory();
        showToast('Riwayat berhasil dihapus', 'success');
      } else {
        showToast('Gagal menghapus riwayat', 'error');
      }
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
      <div className={`${sidebarOpen ? 'w-80' : 'w-33'} transition-all duration-500 ease-in-out relative z-20 flex flex-col rounded-r-3xl overflow-hidden`}>
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
        className={`fixed ${sidebarOpen ? 'left-76' : 'left-29'} top-8 w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 z-40 border-3 border-white/50 hover:scale-110 hover:-translate-y-1`}
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
                  <span className="text-xs text-blue-200 font-medium">
                    {isLoggedIn() ? `Hi, ${user?.name}` : 'Guest Mode'}
                  </span>
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
        
        {/* User Menu & Footer */}
        {sidebarOpen && (
          <div className="p-6 space-y-4">
            {/* User Menu */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl">
              {isLoggedIn() ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{user?.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{user?.name}</div>
                      <div className="text-xs text-blue-200">{user?.role === 'admin' ? '👑 Admin' : '👤 User'}</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full py-2 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold"
                >
                  🔐 Login / Register
                </button>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-xl">
              <div className="text-center">
                <div className="text-2xl mb-3 animate-bounce-slow drop-shadow-lg">✨</div>
                <div className="text-sm font-bold text-white drop-shadow-sm">Modern Analytics</div>
                <div className="text-xs text-white/80 mt-1 drop-shadow-sm">Powered by MAUT Algorithm</div>
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
            {activeTab === "home" && <HomePage />}

            {/* Tab Kalkulasi */}
            {activeTab === "calculate" && (
              <CalculatePage 
                criteria={criteria}
                candidates={candidates}
                setCandidates={setCandidates}
                title={title}
                setTitle={setTitle}
                result={result}
                setResult={setResult}
                loading={loading}
                setLoading={setLoading}
                showToast={showToast}
                fetchHistory={fetchHistory}
                isLoggedIn={isLoggedIn()}
                onLoginClick={() => setShowLogin(true)}
              />
            )}

            {/* Tab Setting Kriteria */}
            {activeTab === "criteria" && (
              <CriteriaPage 
                criteria={criteria}
                setCriteria={setCriteria}
                loading={loading}
                setLoading={setLoading}
                showToast={showToast}
                confirmDelete={confirmDelete}
              />
            )}

            {/* Tab Riwayat */}
            {activeTab === "history" && (
              <HistoryPage 
                history={history}
                confirmDelete={confirmDelete}
                isLoggedIn={isLoggedIn()}
                onLoginClick={() => setShowLogin(true)}
              />
            )}

            {/* Tab About */}
            {activeTab === "about" && <AboutPage />}
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

      {/* Auth Modals */}
      {showLogin && (
        <LoginPage
          onClose={() => setShowLogin(false)}
          switchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <RegisterPage
          onClose={() => setShowRegister(false)}
          switchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;