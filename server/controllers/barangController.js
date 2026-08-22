import Barang from '../models/Barang.js';
import Kategori from '../models/Kategori.js';
import { Op } from 'sequelize';

// Generate kode barang otomatis
const generateKodeBarang = async () => {
  const lastBarang = await Barang.findOne({
    order: [['id', 'DESC']]
  });
  const number = (lastBarang?.id || 0) + 1;
  return `BRG${String(number).padStart(5, '0')}`;
};

export const createBarang = async (req, res) => {
  try {
    const { nama_barang, kategori_id, jumlah, kondisi, lokasi, harga, tanggal_pembelian, keterangan } = req.body;

    if (!nama_barang || !kategori_id) {
      return res.status(400).json({ message: 'Nama barang dan kategori harus diisi' });
    }

    // Cek kategori exist
    const kategori = await Kategori.findByPk(kategori_id);
    if (!kategori) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    const kode_barang = await generateKodeBarang();

    const barang = await Barang.create({
      kode_barang,
      nama_barang,
      kategori_id,
      jumlah: jumlah || 0,
      kondisi: kondisi || 'baik',
      lokasi,
      harga: harga || 0,
      tanggal_pembelian,
      keterangan
    });

    res.status(201).json({
      message: 'Barang berhasil dibuat',
      barang
    });
  } catch (error) {
    console.error('Create barang error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getBarangs = async (req, res) => {
  try {
    const { kategori_id, kondisi, search } = req.query;
    const where = {};

    if (kategori_id) where.kategori_id = kategori_id;
    if (kondisi) where.kondisi = kondisi;
    if (search) {
      where[Op.or] = [
        { nama_barang: { [Op.iLike]: `%${search}%` } },
        { kode_barang: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const barangs = await Barang.findAll({
      where,
      include: [{ model: Kategori, attributes: ['id', 'nama_kategori'] }],
      order: [['created_at', 'DESC']]
    });

    res.json({ barangs });
  } catch (error) {
    console.error('Get barangs error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getBarangById = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.id, {
      include: [{ model: Kategori, attributes: ['id', 'nama_kategori'] }]
    });

    if (!barang) {
      return res.status(404).json({ message: 'Barang tidak ditemukan' });
    }

    res.json({ barang });
  } catch (error) {
    console.error('Get barang error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateBarang = async (req, res) => {
  try {
    const { nama_barang, kategori_id, jumlah, kondisi, lokasi, harga, tanggal_pembelian, keterangan } = req.body;
    const barang = await Barang.findByPk(req.params.id);

    if (!barang) {
      return res.status(404).json({ message: 'Barang tidak ditemukan' });
    }

    // Cek kategori jika diubah
    if (kategori_id && kategori_id !== barang.kategori_id) {
      const kategori = await Kategori.findByPk(kategori_id);
      if (!kategori) {
        return res.status(404).json({ message: 'Kategori tidak ditemukan' });
      }
    }

    await barang.update({
      nama_barang,
      kategori_id,
      jumlah,
      kondisi,
      lokasi,
      harga,
      tanggal_pembelian,
      keterangan
    });

    res.json({
      message: 'Barang berhasil diperbarui',
      barang
    });
  } catch (error) {
    console.error('Update barang error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deleteBarang = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.id);

    if (!barang) {
      return res.status(404).json({ message: 'Barang tidak ditemukan' });
    }

    await barang.destroy();

    res.json({ message: 'Barang berhasil dihapus' });
  } catch (error) {
    console.error('Delete barang error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
