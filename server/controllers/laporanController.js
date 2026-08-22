import Barang from '../models/Barang.js';
import Peminjaman from '../models/Peminjaman.js';
import Kategori from '../models/Kategori.js';
import { sequelize } from '../config/database.js';
import { Op } from 'sequelize';

export const getDashboardStats = async (req, res) => {
  try {
    const totalBarang = await Barang.count();
    const barangBaik = await Barang.count({ where: { kondisi: 'baik' } });
    const barangRusak = await Barang.count({ where: { kondisi: { [Op.in]: ['rusak_ringan', 'rusak_berat'] } } });
    const totalPeminjaman = await Peminjaman.count({ where: { status: 'dipinjam' } });
    const totalKategori = await Kategori.count();

    const stats = {
      totalBarang,
      barangBaik,
      barangRusak,
      totalPeminjaman,
      totalKategori
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getBarangByKategori = async (req, res) => {
  try {
    const data = await Barang.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      include: [{
        model: Kategori,
        attributes: ['nama_kategori']
      }],
      group: ['Kategori.id'],
      raw: true
    });

    res.json({ data });
  } catch (error) {
    console.error('Get barang by kategori error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getPeminjamanReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};

    if (startDate || endDate) {
      where.tanggal_pinjam = {};
      if (startDate) where.tanggal_pinjam[Op.gte] = new Date(startDate);
      if (endDate) where.tanggal_pinjam[Op.lte] = new Date(endDate);
    }

    const peminjamans = await Peminjaman.findAll({
      where,
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Barang, attributes: ['nama_barang', 'kode_barang'] }
      ],
      order: [['tanggal_pinjam', 'DESC']]
    });

    res.json({ peminjamans });
  } catch (error) {
    console.error('Get peminjaman report error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getInventoryReport = async (req, res) => {
  try {
    const { kategori_id, kondisi } = req.query;
    const where = {};

    if (kategori_id) where.kategori_id = kategori_id;
    if (kondisi) where.kondisi = kondisi;

    const barangs = await Barang.findAll({
      where,
      include: [{ model: Kategori, attributes: ['nama_kategori'] }],
      order: [['nama_barang', 'ASC']]
    });

    const totalNilai = barangs.reduce((sum, b) => sum + (b.harga * b.jumlah), 0);

    res.json({
      barangs,
      summary: {
        totalBarang: barangs.length,
        totalUnit: barangs.reduce((sum, b) => sum + b.jumlah, 0),
        totalNilai
      }
    });
  } catch (error) {
    console.error('Get inventory report error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
