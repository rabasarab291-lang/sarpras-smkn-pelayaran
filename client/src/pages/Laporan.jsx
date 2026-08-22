import { useEffect, useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import { laporanService } from '../services/apiService';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function Laporan() {
  const [stats, setStats] = useState(null);
  const [barangByKategori, setBarangByKategori] = useState([]);
  const [peminjamanReport, setPeminjamanReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    fetchReports();
  }, [dateFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [stats, barangKat, peminjaman] = await Promise.all([
        laporanService.getDashboardStats(),
        laporanService.getBarangByKategori(),
        laporanService.getPeminjamanReport(dateFilter)
      ]);
      setStats(stats);
      setBarangByKategori(barangKat.data || []);
      setPeminjamanReport(peminjaman.data || []);
    } catch (err) {
      setError('Gagal memuat laporan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleDownload = () => {
    // TODO: Implement PDF download
    alert('Fitur download laporan akan segera tersedia');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-8 text-center">
          <p className="text-gray-600">Memuat laporan...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Laporan & Analisis</h1>
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center gap-2"
          >
            <Download size={18} />
            Download Laporan
          </button>
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        {/* Date Filter */}
        <div className="card mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Filter Tanggal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Tanggal Mulai</label>
              <input
                type="date"
                name="startDate"
                value={dateFilter.startDate}
                onChange={handleDateChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Akhir</label>
              <input
                type="date"
                name="endDate"
                value={dateFilter.endDate}
                onChange={handleDateChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <p className="text-gray-600 text-sm">Total Barang</p>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalBarang || 0}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Barang Tersedia</p>
            <p className="text-3xl font-bold text-green-600">{stats?.barangTersedia || 0}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Sedang Dipinjam</p>
            <p className="text-3xl font-bold text-orange-600">{stats?.peminjamanAktif || 0}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Total Kategori</p>
            <p className="text-3xl font-bold text-purple-600">{stats?.totalKategori || 0}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Barang by Kategori - Bar Chart */}
          {barangByKategori.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Barang per Kategori</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barangByKategori}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nama" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Barang by Kategori - Pie Chart */}
          {barangByKategori.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Distribusi Barang</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={barangByKategori}
                    dataKey="jumlah"
                    nameKey="nama"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {barangByKategori.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Peminjaman Report Table */}
        {peminjamanReport.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Data Peminjaman</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Peminjam</th>
                    <th>Barang</th>
                    <th>Jumlah</th>
                    <th>Tanggal Pinjam</th>
                    <th>Tanggal Kembali</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {peminjamanReport.map(p => (
                    <tr key={p.id}>
                      <td>{p.peminjam}</td>
                      <td>{p.barang}</td>
                      <td>{p.jumlah}</td>
                      <td>{new Date(p.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
                      <td>{new Date(p.tanggal_kembali).toLocaleDateString('id-ID')}</td>
                      <td>
                        <span className={`badge ${p.status === 'dikembalikan' ? 'badge-success' : 'badge-warning'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {peminjamanReport.length === 0 && !loading && (
          <div className="card text-center py-8">
            <p className="text-gray-600">Tidak ada data peminjaman untuk periode ini</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Laporan;
