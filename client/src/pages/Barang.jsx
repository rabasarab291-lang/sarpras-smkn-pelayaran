import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import { barangService } from '../services/apiService';
import useStore from '../store/authStore';

function Barang() {
  const [barangs, setBarangs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nama: '', kategori_id: '', jumlah: '', kondisi: 'baik' });
  const [editingId, setEditingId] = useState(null);
  const { user, setNotification } = useStore();
  const isAdmin = user?.role === 'admin';
  const isKepalaGudang = user?.role === 'kepala_gudang';
  const canEdit = isAdmin || isKepalaGudang;

  useEffect(() => {
    fetchBarangs();
  }, []);

  const fetchBarangs = async () => {
    try {
      setLoading(true);
      const data = await barangService.getAll();
      setBarangs(data.data || []);
    } catch (err) {
      setError('Gagal memuat data barang');
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
      if (editingId) {
        await barangService.update(editingId, formData);
        setNotification({ type: 'success', message: 'Barang berhasil diperbarui' });
        setEditingId(null);
      } else {
        await barangService.create(formData);
        setNotification({ type: 'success', message: 'Barang berhasil ditambahkan' });
      }
      setFormData({ nama: '', kategori_id: '', jumlah: '', kondisi: 'baik' });
      setShowForm(false);
      fetchBarangs();
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Gagal menyimpan barang' });
    }
  };

  const handleEdit = (barang) => {
    setFormData(barang);
    setEditingId(barang.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus?')) {
      try {
        await barangService.delete(id);
        setNotification({ type: 'success', message: 'Barang berhasil dihapus' });
        fetchBarangs();
      } catch (err) {
        setNotification({ type: 'error', message: 'Gagal menghapus barang' });
      }
    }
  };

  const filteredBarangs = barangs.filter(b =>
    b.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Data Barang</h1>
          {canEdit && (
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({ nama: '', kategori_id: '', jumlah: '', kondisi: 'baik' });
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah Barang
            </button>
          )}
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        {showForm && canEdit && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'Edit Barang' : 'Tambah Barang Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Nama Barang</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <input
                    type="text"
                    name="kategori_id"
                    value={formData.kategori_id}
                    onChange={handleChange}
                    className="form-input"
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
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Kondisi</label>
                  <select
                    name="kondisi"
                    value={formData.kondisi}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="baik">Baik</option>
                    <option value="kurang_baik">Kurang Baik</option>
                    <option value="rusak">Rusak</option>
                  </select>
                </div>
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
              placeholder="Cari barang..."
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
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Jumlah</th>
                  <th>Kondisi</th>
                  {canEdit && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {filteredBarangs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-4">
                      Tidak ada data barang
                    </td>
                  </tr>
                ) : (
                  filteredBarangs.map(barang => (
                    <tr key={barang.id}>
                      <td>{barang.nama}</td>
                      <td>{barang.kategori}</td>
                      <td>{barang.jumlah}</td>
                      <td>
                        <span className={`badge badge-${barang.kondisi === 'baik' ? 'success' : barang.kondisi === 'kurang_baik' ? 'warning' : 'danger'}`}>
                          {barang.kondisi}
                        </span>
                      </td>
                      {canEdit && (
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(barang)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(barang.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      )}
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

export default Barang;
