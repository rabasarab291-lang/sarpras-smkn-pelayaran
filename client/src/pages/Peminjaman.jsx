import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { peminjamanService, barangService } from '../services/apiService';
import useStore from '../store/authStore';

function Peminjaman() {
  const [peminjamans, setPeminjamans] = useState([]);
  const [barangs, setBarangs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    barang_id: '',
    peminjam: '',
    jumlah: 1,
    tujuan: '',
    tanggal_kembali: ''
  });
  const [returningId, setReturningId] = useState(null);
  const [returnQuantity, setReturnQuantity] = useState({});
  const { setNotification } = useStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [peminjamanData, barangData] = await Promise.all([
        peminjamanService.getAll(),
        barangService.getAll()
      ]);
      setPeminjamans(peminjamanData.data || []);
      setBarangs(barangData.data || []);
    } catch (err) {
      setError('Gagal memuat data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await peminjamanService.create(formData);
      setNotification({ type: 'success', message: 'Peminjaman berhasil dicatat' });
      setFormData({ barang_id: '', peminjam: '', jumlah: 1, tujuan: '', tanggal_kembali: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Gagal mencatat peminjaman' });
    }
  };

  const handleReturn = async (id) => {
    try {
      const quantity = returnQuantity[id] || 1;
      await peminjamanService.returnBarang(id, { jumlah_kembali: quantity });
      setNotification({ type: 'success', message: 'Barang berhasil dikembalikan' });
      setReturningId(null);
      setReturnQuantity({});
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', message: 'Gagal mengembalikan barang' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus?')) {
      try {
        await peminjamanService.delete(id);
        setNotification({ type: 'success', message: 'Peminjaman berhasil dihapus' });
        fetchData();
      } catch (err) {
        setNotification({ type: 'error', message: 'Gagal menghapus peminjaman' });
      }
    }
  };

  const filteredPeminjamans = peminjamans.filter(p =>
    p.peminjam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barang?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Data Peminjaman</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setFormData({ barang_id: '', peminjam: '', jumlah: 1, tujuan: '', tanggal_kembali: '' });
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Catat Peminjaman
          </button>
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        {showForm && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Catat Peminjaman Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Barang</label>
                  <select
                    name="barang_id"
                    value={formData.barang_id}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Pilih Barang</option>
                    {barangs.map(b => (
                      <option key={b.id} value={b.id}>{b.nama}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Peminjam</label>
                  <input
                    type="text"
                    name="peminjam"
                    value={formData.peminjam}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Nama peminjam"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Jumlah</label>
                  <input
                    type="number"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal Kembali</label>
                  <input
                    type="date"
                    name="tanggal_kembali"
                    value={formData.tanggal_kembali}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tujuan</label>
                <textarea
                  name="tujuan"
                  value={formData.tujuan}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Tujuan peminjaman"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Simpan</button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari peminjam atau barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Memuat data...</p>
          </div>
        ) : (
          <div className="table-container card">
            <table className="table">
              <thead>
                <tr>
                  <th>Peminjam</th>
                  <th>Barang</th>
                  <th>Jumlah</th>
                  <th>Tanggal Kembali</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeminjamans.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-4">
                      Tidak ada data peminjaman
                    </td>
                  </tr>
                ) : (
                  filteredPeminjamans.map(peminjaman => (
                    <tr key={peminjaman.id}>
                      <td>{peminjaman.peminjam}</td>
                      <td>{peminjaman.barang}</td>
                      <td>{peminjaman.jumlah}</td>
                      <td>{new Date(peminjaman.tanggal_kembali).toLocaleDateString('id-ID')}</td>
                      <td>
                        <span className={`badge ${peminjaman.status === 'dipinjam' ? 'badge-warning' : 'badge-success'}`}>
                          {peminjaman.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {peminjaman.status === 'dipinjam' && (
                            <>
                              {returningId === peminjaman.id ? (
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    min="1"
                                    max={peminjaman.jumlah}
                                    value={returnQuantity[peminjaman.id] || 1}
                                    onChange={(e) => setReturnQuantity({ ...returnQuantity, [peminjaman.id]: parseInt(e.target.value) })}
                                    className="form-input w-16 h-8 text-sm"
                                  />
                                  <button
                                    onClick={() => handleReturn(peminjaman.id)}
                                    className="btn-primary text-sm py-1 px-2"
                                  >
                                    OK
                                  </button>
                                  <button
                                    onClick={() => setReturningId(null)}
                                    className="btn-secondary text-sm py-1 px-2"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setReturningId(peminjaman.id)}
                                  className="text-green-600 hover:text-green-800 flex items-center gap-1"
                                  title="Kembalikan"
                                >
                                  <ArrowRight size={18} />
                                </button>
                              )}
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(peminjaman.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Peminjaman;
