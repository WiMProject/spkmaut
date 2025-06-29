const MAUTInfo = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 card-hover border border-gray-100">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4 animate-bounce-slow">📚</div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Tentang Metode MAUT</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
              <span className="mr-2">🤔</span> Apa itu MAUT?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-blue-600">Multi-Attribute Utility Theory (MAUT)</strong> adalah metode pengambilan keputusan 
              yang mengevaluasi alternatif berdasarkan beberapa kriteria dengan memberikan bobot 
              pada setiap kriteria sesuai tingkat kepentingannya.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
              <span className="mr-2">⭐</span> Keunggulan MAUT:
            </h3>
            <ul className="text-gray-700 space-y-3">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Objektif dan terukur</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Mempertimbangkan multiple criteria</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Hasil transparan dan dapat dipertanggungjawabkan</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Fleksibel dalam penentuan bobot kriteria</li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
              <span className="mr-2">🚀</span> Cara Penggunaan:
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 group">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform">1</div>
                <p className="text-gray-700 group-hover:text-purple-700 transition-colors">Atur kriteria dan bobot di tab "Setting Kriteria"</p>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform">2</div>
                <p className="text-gray-700 group-hover:text-purple-700 transition-colors">Tambahkan kandidat dan masukkan skor untuk setiap kriteria</p>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform">3</div>
                <p className="text-gray-700 group-hover:text-purple-700 transition-colors">Klik "Hitung MAUT" untuk mendapatkan ranking kandidat</p>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform">4</div>
                <p className="text-gray-700 group-hover:text-purple-700 transition-colors">Lihat riwayat kalkulasi di tab "Riwayat"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-lg">
        <div className="flex items-center mb-3">
          <div className="text-2xl mr-3 animate-pulse-slow">💡</div>
          <h4 className="font-bold text-amber-800 text-lg">Tips Penggunaan</h4>
        </div>
        <p className="text-amber-700 leading-relaxed">
          Pastikan total bobot kriteria = <span className="font-bold bg-amber-200 px-2 py-1 rounded">1.0 (100%)</span> untuk hasil yang optimal. 
          Gunakan kriteria <span className="font-semibold text-green-600">"Benefit"</span> untuk nilai yang semakin tinggi semakin baik, 
          dan <span className="font-semibold text-red-600">"Cost"</span> untuk nilai yang semakin rendah semakin baik.
        </p>
      </div>
    </div>
  );
};

export default MAUTInfo;