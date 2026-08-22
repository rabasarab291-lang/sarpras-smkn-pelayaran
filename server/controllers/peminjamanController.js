import Peminjaman from '../models/Peminjaman.js';
import Barang from '../models/Barang.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

const generateNomorPeminjaman = async () => {
  const lastPeminjaman = await Peminjaman.findOne({
    order: [['id', 'DESC']]
  });
  const number = (lastPeminjaman?.id || 0) + 1;
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `PJM${date}${String(number).padStart(4, '0')}`;
};

export const createPeminjaman = async (req, res) => {
  try {
    const { barang_id, jumlah_pinjam, tanggal_kembali_rencana, keterangan } = req.body;
    const user_id = req.user.id;

    if (!barang_id || !jumlah_pinjam) {
      return res.status(400).json({ message: 'Barang dan jumlah harus diisi' });
    }

    const barang = await Barang.findByPk(barang_id);
    if (!barang) {
      return res.status(404).json({ message: 'Barang tidak ditemukan' });
    }

    if (barang.jumlah < jumlah_pinjam) {
      return res.status(400).json({ message: 'Stok barang tidak cukup' });
    }

    const nomor_peminjaman = await generateNomorPeminjaman();

    const peminjaman = await Peminjaman.create({
      nomor_peminjaman,
      user_id,
      barang_id,
      jumlah_pinjam,
      tanggal_kembali_rencana,
      keterangan,
      status: 'dipinjam'
    });

    // Kurangi stok barang
    await barang.update({
      jumlah: barang.jumlah - jumlah_pinjam
    });

    res.status(201).json({
      message: 'Peminjaman berhasil dibuat',
      peminjaman
    });
  } catch (error) {
    console.error('Create peminjaman error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getPeminjamans = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { nomor_peminjaman: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const peminjamans = await Peminjaman.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Barang, attributes: ['id', 'kode_barang', 'nama_barang'] }
      ],
      order: [['tanggal_pinjam', 'DESC']]
    });

    res.json({ peminjamans });
  } catch (error) {
    console.error('Get peminjamans error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const returnBarang = async (req, res) => {
  try {
    const { id } = req.params;
    const { keterangan } = req.body;

    const peminjaman = await Peminjaman.findByPk(id, {
      include: [{ model: Barang }]
    });

    if (!peminjaman) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
    }

    if (peminjaman.status !== 'dipinjam') {
      return res.status(400).json({ message: 'Barang sudah dikembalikan atau hilang' });
    }

    // Update peminjaman
    await peminjaman.update({
      tanggal_kembali_aktual: new Date(),
      status: 'dikembalikan',
      keterangan: keterangan || peminjaman.keterangan
    });

    // Tambah stok barang
    await peminjaman.Barang.update({
      jumlah: peminjaman.Barang.jumlah + peminjaman.jumlah_pinjam
    });

    res.json({
      message: 'Barang berhasil dikembalikan',
      peminjaman
    });
  } catch (error) {
    console.error('Return barang error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deletePeminjaman = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findByPk(req.params.id, {
      include: [{ model: Barang }]
    });

    if (!peminjaman) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
    }

    if (peminjaman.status === 'dipinjam') {
      // Return barang ke stok
      await peminjaman.Barang.update({
        jumlah: peminjaman.Barang.jumlah + peminjaman.jumlah_pinjam
      });
    }

    await peminjaman.destroy();

    res.json({ message: 'Peminjaman berhasil dihapus' });
  } catch (error) {
    console.error('Delete peminjaman error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
