import Kategori from '../models/Kategori.js';
import { Op } from 'sequelize';

export const createKategori = async (req, res) => {
  try {
    const { nama_kategori, deskripsi } = req.body;

    if (!nama_kategori) {
      return res.status(400).json({ message: 'Nama kategori harus diisi' });
    }

    // Cek duplikat
    const existing = await Kategori.findOne({ where: { nama_kategori } });
    if (existing) {
      return res.status(409).json({ message: 'Kategori sudah ada' });
    }

    const kategori = await Kategori.create({ nama_kategori, deskripsi });

    res.status(201).json({
      message: 'Kategori berhasil dibuat',
      kategori
    });
  } catch (error) {
    console.error('Create kategori error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getKategoris = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search) {
      where.nama_kategori = { [Op.iLike]: `%${search}%` };
    }

    const kategoris = await Kategori.findAll({
      where,
      order: [['nama_kategori', 'ASC']]
    });

    res.json({ kategoris });
  } catch (error) {
    console.error('Get kategoris error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getKategoriById = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);

    if (!kategori) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    res.json({ kategori });
  } catch (error) {
    console.error('Get kategori error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateKategori = async (req, res) => {
  try {
    const { nama_kategori, deskripsi } = req.body;
    const kategori = await Kategori.findByPk(req.params.id);

    if (!kategori) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    // Cek duplikat nama
    if (nama_kategori && nama_kategori !== kategori.nama_kategori) {
      const existing = await Kategori.findOne({ where: { nama_kategori } });
      if (existing) {
        return res.status(409).json({ message: 'Nama kategori sudah digunakan' });
      }
    }

    await kategori.update({ nama_kategori, deskripsi });

    res.json({
      message: 'Kategori berhasil diperbarui',
      kategori
    });
  } catch (error) {
    console.error('Update kategori error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deleteKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);

    if (!kategori) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    await kategori.destroy();

    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    console.error('Delete kategori error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
