import BlurOverlay from "../components/BlurOverlay";

function HistoryPage({ history, confirmDelete, isLoggedIn, onLoginClick }) {
  if (!isLoggedIn) {
    return (
      <div className="relative space-y-10 max-w-7xl mx-auto">
        <BlurOverlay onLoginClick={onLoginClick} />
        
        {/* Blurred Content */}
        <div className="filter blur-sm pointer-events-none">
          <div className="text-center mb-10">
            <div className="inline-250 items-center space-x-4 bg-gradient-to-r from-indigo-50 to-blue-50 px-8 py-4 rounded-2xl border border-indigo-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📊</span>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Riwayat Kalkulasi</h1>
                <p className="text-gray-600 text-sm">Lihat hasil perhitungan MAUT sebelumnya</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white border border-indigo-200/50 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">Pemilihan Ketua BEM 2024</h3>
                    <p className="text-gray-500 text-sm">🕒 12/06/2024, 14:30:25</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                      👥 3 kandidat
                    </span>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-700 mb-4">🏆 Top 3 Hasil:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-yellow-500 text-white">1</div>
                        <span className="font-semibold">Kandidat A</span>
                      </div>
                      <span className="font-bold text-blue-600">0.8945</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-400 text-white">2</div>
                        <span className="font-semibold">Kandidat B</span>
                      </div>
                      <span className="font-bold text-blue-600">0.7823</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-indigo-200/50 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">Seleksi Calon Ketua OSIS</h3>
                    <p className="text-gray-500 text-sm">🕒 10/06/2024, 09:15:42</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                      👥 4 kandidat
                    </span>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-700 mb-4">🏆 Top 3 Hasil:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-yellow-500 text-white">1</div>
                        <span className="font-semibold">Sarah M</span>
                      </div>
                      <span className="font-bold text-blue-600">0.9123</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-400 text-white">2</div>
                        <span className="font-semibold">Ahmad R</span>
                      </div>
                      <span className="font-bold text-blue-600">0.8567</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
                      className="p-3 bg-red-500 text-white hover:bg-red-600 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg font-bold"
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
  );
}

export default HistoryPage;