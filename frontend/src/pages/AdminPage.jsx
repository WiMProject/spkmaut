import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function AdminPage({ showToast }) {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCalculations: 0,
    activeUsers: 0,
    guestCalculations: 0
  });
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    if (!token) {
      showToast('Token tidak ditemukan, silakan login ulang', 'error');
      return;
    }
    
    try {
      console.log('Fetching users...');
      const res = await fetch('http://localhost:8000/api/admin/users', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Users data:', data);
        setUsers(data.users || []);
      } else if (res.status === 401) {
        showToast('Token expired, silakan login ulang', 'error');
      } else if (res.status === 403) {
        showToast('Akses ditolak, Anda bukan admin', 'error');
      } else {
        const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
        showToast(`Error: ${errorData.detail}`, 'error');
      }
    } catch (e) {
      console.error('Network error:', e);
      showToast('Tidak dapat terhubung ke server. Pastikan server berjalan di port 8000', 'error');
    }
  };

  const fetchStats = async () => {
    if (!token) return;
    
    try {
      const res = await fetch('http://localhost:8000/api/admin/stats', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        console.error('Failed to fetch stats:', res.status);
      }
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        fetchUsers();
        fetchStats();
        showToast('User berhasil dihapus', 'success');
      } else {
        showToast('Gagal menghapus user', 'error');
      }
    } catch (e) {
      showToast('Error menghapus user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (res.ok) {
        fetchUsers();
        showToast(`Role berhasil diubah ke ${newRole}`, 'success');
      } else {
        showToast('Gagal mengubah role', 'error');
      }
    } catch (e) {
      showToast('Error mengubah role', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      showToast('Semua field harus diisi', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        fetchUsers();
        fetchStats();
        setShowAddUser(false);
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        showToast('User berhasil ditambahkan', 'success');
      } else {
        const error = await res.json();
        showToast(error.detail || 'Gagal menambah user', 'error');
      }
    } catch (e) {
      showToast('Error menambah user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    if (!editUser.name || !editUser.email) {
      showToast('Nama dan email harus diisi', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${editUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editUser.name,
          email: editUser.email,
          role: editUser.role
        })
      });

      if (res.ok) {
        fetchUsers();
        setEditUser(null);
        showToast('User berhasil diupdate', 'success');
      } else {
        const error = await res.json();
        showToast(error.detail || 'Gagal update user', 'error');
      }
    } catch (e) {
      showToast('Error update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-red-50 to-pink-50 px-8 py-4 rounded-2xl border border-red-200/50">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">👑</span>
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Admin Panel</h1>
            <p className="text-gray-600 text-sm">Kelola user dan monitor sistem</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">👥</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">{stats.totalUsers}</div>
              <div className="text-sm text-blue-600 font-medium">Total Users</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🧮</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">{stats.totalCalculations}</div>
              <div className="text-sm text-green-600 font-medium">Total Kalkulasi</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">⚡</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700">{stats.activeUsers}</div>
              <div className="text-sm text-purple-600 font-medium">Active Users</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🔓</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-700">{stats.guestCalculations}</div>
              <div className="text-sm text-orange-600 font-medium">Guest Kalkulasi</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <p className="text-gray-600 mt-1">Kelola semua user yang terdaftar</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddUser(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
              >
                ➕ Tambah User
              </button>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bergabung</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditUser(user)}
                        disabled={loading}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-semibold"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => toggleUserRole(user.id, user.role)}
                        disabled={loading}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          user.role === 'admin'
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                      >
                        {user.role === 'admin' ? '👤 User' : '👑 Admin'}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        disabled={loading}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-semibold"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-lg font-semibold">Loading users...</p>
            <p className="text-sm mt-2">Jika tidak muncul, coba refresh atau login ulang</p>
            <button 
              onClick={() => {
                console.log('Debug - Current token:', token);
                fetchUsers();
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Debug & Retry
            </button>
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
        <h3 className="text-xl font-bold text-indigo-800 mb-4">📊 System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-indigo-700 mb-2">Database Status</h4>
            <p className="text-indigo-600">✅ Connected & Operational</p>
          </div>
          <div>
            <h4 className="font-semibold text-indigo-700 mb-2">Server Status</h4>
            <p className="text-indigo-600">🟢 Online & Running</p>
          </div>
          <div>
            <h4 className="font-semibold text-indigo-700 mb-2">Last Updated</h4>
            <p className="text-indigo-600">{new Date().toLocaleString('id-ID')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-indigo-700 mb-2">Version</h4>
            <p className="text-indigo-600">SPK MAUT v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">➕ Tambah User Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="email@domain.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="user">👤 User</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddUser(false)}
                className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors font-semibold"
              >
                Batal
              </button>
              <button
                onClick={addUser}
                disabled={loading}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? 'Menambah...' : 'Tambah User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">✏️ Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editUser.name}
                  onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editUser.email}
                  onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editUser.role}
                  onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                >
                  <option value="user">👤 User</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setEditUser(null)}
                className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors font-semibold"
              >
                Batal
              </button>
              <button
                onClick={updateUser}
                disabled={loading}
                className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;