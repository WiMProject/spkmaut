import LoadingSpinner from "../components/LoadingSpinner";
import ProgressBar from "../components/ProgressBar";

function CriteriaPage({ criteria, setCriteria, loading, setLoading, showToast, confirmDelete }) {
  
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

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-250 items-center space-x-4 bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-4 rounded-2xl border border-purple-200/50">
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
      <div className="flex flex-col sm:flex-row justify-end gap-4 mb-10">
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
      <div className="space-y-10">
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
                  className="p-4 bg-red-500 text-white hover:bg-red-600 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Nama Kriteria</label>
                  <input
                    type="text"
                    placeholder="Nama kriteria"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    value={c.name}
                    onChange={(e) => handleCriteriaChange(i, "name", e.target.value)}
                  />
                </div>
                
                <div className="space-y-4">
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
                  <div className="mt-4">
                    <ProgressBar value={c.weight * 100} max={100} color="purple" />
                    <div className="text-center text-sm font-semibold text-purple-600 mt-2">
                      {(c.weight * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Tipe Kriteria</label>
                  <select
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    value={c.type}
                    onChange={(e) => handleCriteriaChange(i, "type", e.target.value)}
                  >
                    <option value="benefit">📈 Benefit</option>
                    <option value="cost">📉 Cost</option>
                  </select>
                  <div className="mt-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      c.type === "benefit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {c.type === "benefit" ? "Benefit" : "Cost"}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Rentang Nilai</label>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-3 block font-medium">Nilai Minimum</label>
                        <input
                          type="number"
                          step={c.decimal ? "0.1" : "1"}
                          placeholder="Nilai minimum"
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-center font-medium"
                          value={c.min_value || 0}
                          onChange={(e) => handleCriteriaChange(i, "min_value", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 mb-3 block font-medium">Nilai Maksimum</label>
                        <input
                          type="number"
                          step={c.decimal ? "0.1" : "1"}
                          placeholder="Nilai maksimum"
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-center font-medium"
                          value={c.max_value || 100}
                          onChange={(e) => handleCriteriaChange(i, "max_value", parseFloat(e.target.value) || 100)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center py-3">
                      <label className="flex items-center space-x-3 cursor-pointer bg-gray-50 px-4 py-2 rounded-xl">
                        <input
                          type="checkbox"
                          checked={c.decimal || false}
                          onChange={(e) => handleCriteriaChange(i, "decimal", e.target.checked)}
                          className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700 font-semibold">Izinkan Desimal</span>
                      </label>
                    </div>
                    <div className="text-center">
                      <span className="inline-block px-4 py-2 rounded-xl text-sm font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                        Rentang: {c.min_value || 0} - {c.max_value || 100} {c.decimal ? "(Desimal)" : "(Bulat)"}
                      </span>
                    </div>
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
  );
}

export default CriteriaPage;