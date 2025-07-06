function BlurOverlay({ onLoginClick }) {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-10 rounded-2xl">
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <span className="text-3xl">🔒</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Login untuk Melihat Hasil</h3>
        <p className="text-gray-600 mb-8 max-w-sm">
          Hasil kalkulasi MAUT tersedia setelah Anda masuk ke akun. 
          Daftar gratis untuk menyimpan dan melihat riwayat kalkulasi.
        </p>
        <div className="space-y-3">
          <button
            onClick={onLoginClick}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg"
          >
            🔐 Masuk / Daftar
          </button>
          <div className="text-sm text-gray-500">
            Gratis • Tanpa biaya • Aman
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlurOverlay;