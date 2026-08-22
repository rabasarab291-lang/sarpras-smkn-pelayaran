import { useEffect, useState } from 'react';
import { BarChart3, Package, Users, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import { laporanService } from '../services/apiService';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await laporanService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Gagal memuat statistik');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {error && (
          <div className="alert alert-error mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Memuat data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Barang */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Barang</p>
                  <p className="text-3xl font-bold text-gray-800">{stats?.totalBarang || 0}</p>
                </div>
                <Package className="text-blue-500" size={32} />
              </div>
            </div>

            {/* Barang Tersedia */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Barang Tersedia</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.barangTersedia || 0}</p>
                </div>
                <TrendingUp className="text-green-500" size={32} />
              </div>
            </div>

            {/* Peminjaman Aktif */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Peminjaman Aktif</p>
                  <p className="text-3xl font-bold text-orange-600">{stats?.peminjamanAktif || 0}</p>
                </div>
                <Users className="text-orange-500" size={32} />
              </div>
            </div>

            {/* Total Kategori */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Kategori</p>
                  <p className="text-3xl font-bold text-purple-600">{stats?.totalKategori || 0}</p>
                </div>
                <BarChart3 className="text-purple-500" size={32} />
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Selamat Datang di Sarpras SMKN</h2>
          <p className="text-gray-600 mb-4">
            Sistem Manajemen Sarana dan Prasarana SMKN Pelayaran Kalimantan Samarinda membantu Anda mengelola inventaris barang dengan efisien.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Kelola data barang dan kategori</li>
            <li>Catat peminjaman dan pengembalian barang</li>
            <li>Lihat laporan dan analisis inventaris</li>
            <li>Monitor status dan kondisi barang</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
