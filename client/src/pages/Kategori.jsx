import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import { kategoriService } from '../services/apiService';
import useStore from '../store/authStore';

function Kategori() {
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nama: '', deskripsi: '' });
  const [editingId, setEditingId] = useState(null);
  const { user, setNotification } = useStore();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchKategoris();
  }, []);

  const fetchKategoris = async () => {
    try {
      setLoading(true);
      const data = await kategoriService.getAll();
      setKategoris(data.data || []);
    } catch (err) {
      setError('Gagal memuat data kategori');
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
        await kategoriService.update(editingId, formData);
        setNotification({ type: 'success', message: 'Kategori berhasil diperbarui' });
        setEditingId(null);
      } else {
        await kategoriService.create(formData);
        setNotification({ type: 'success', message: 'Kategori berhasil ditambahkan' });
      }
      setFormData({ nama: '', deskripsi: '' });
      setShowForm(false);
      fetchKategoris();
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Gagal menyimpan kategori' });
    }
  };

  const handleEdit = (kategori) => {
    setFormData(kategori);
    setEditingId(kategori.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus?')) {
      try {
        await kategoriService.delete(id);
        setNotification({ type: 'success', message: 'Kategori berhasil dihapus' });
        fetchKategoris();
      } catch (err) {
        setNotification({ type: 'error', message: 'Gagal menghapus kategori' });
      }
    }
  };

  const filteredKategoris = kategoris.filter(k =>
    k.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Data Kategori</h1>
          {isAdmin && (
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({ nama: '', deskripsi: '' });
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah Kategori
            </button>
          )}
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        {showForm && isAdmin && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Nama Kategori</label>
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
                <label className="form-label">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  className="form-input"
                  rows="4"
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
              placeholder="Cari kategori..."
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
                  <th>Nama Kategori</th>
                  <th>Deskripsi</th>
                  {isAdmin && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {filteredKategoris.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 py-4">
                      Tidak ada data kategori
                    </td>
                  </tr>
                ) : (
                  filteredKategoris.map(kategori => (
                    <tr key={kategori.id}>
                      <td className="font-semibold">{kategori.nama}</td>
                      <td>{kategori.deskripsi}</td>
                      {isAdmin && (
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(kategori)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(kategori.id)}
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

export default Kategori;
