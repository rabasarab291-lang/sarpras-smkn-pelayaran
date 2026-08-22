const express = require('express');
const { PeminjamanBarang, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// GET all peminjaman barang with filters
router.get('/', authenticate, async (req, res) => {
  try {
    const { startDate, endDate, status, search } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.tanggal = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { nama_peminjam: { [Op.iLike]: `%${search}%` } },
        { unit_kelas: { [Op.iLike]: `%${search}%` } },
        { nama_barang: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const data = await PeminjamanBarang.findAll({
      where,
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['tanggal', 'DESC']]
    });

    res.json({
      success: true,
      data,
      total: data.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single peminjaman barang
router.get('/:id', authenticate, async (req, res) => {
  try {
    const data = await PeminjamanBarang.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    if (!data) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE peminjaman barang
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      tanggal,
      nama_peminjam,
      unit_kelas,
      nama_barang,
      jumlah_barang,
      jam_pinjam,
      kondisi_awal,
      ttd_pinjam,
      keterangan
    } = req.body;

    // Validasi input
    if (!tanggal || !nama_peminjam || !unit_kelas || !nama_barang || !jumlah_barang || !jam_pinjam) {
      return res.status(400).json({
        success: false,
        message: 'Field yang diperlukan: tanggal, nama_peminjam, unit_kelas, nama_barang, jumlah_barang, jam_pinjam'
      });
    }

    const data = await PeminjamanBarang.create({
      tanggal,
      nama_peminjam,
      unit_kelas,
      nama_barang,
      jumlah_barang,
      jam_pinjam,
      kondisi_awal,
      ttd_pinjam,
      keterangan,
      user_id: req.user.id,
      status: 'dipinjam'
    });

    res.status(201).json({
      success: true,
      message: 'Peminjaman barang berhasil dicatat',
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE peminjaman barang (untuk pencatatan pengembalian)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { jam_kembali, kondisi_akhir, ttd_kembali, keterangan } = req.body;

    const data = await PeminjamanBarang.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    await data.update({
      jam_kembali: jam_kembali || data.jam_kembali,
      kondisi_akhir: kondisi_akhir || data.kondisi_akhir,
      ttd_kembali: ttd_kembali || data.ttd_kembali,
      keterangan: keterangan || data.keterangan,
      status: jam_kembali ? 'dikembalikan' : data.status
    });

    res.json({
      success: true,
      message: 'Pengembalian barang berhasil dicatat',
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE peminjaman barang
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const data = await PeminjamanBarang.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    await data.destroy();

    res.json({
      success: true,
      message: 'Peminjaman barang berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET report by date range
router.get('/report/export', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.tanggal = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const data = await PeminjamanBarang.findAll({
      where,
      include: [{ model: User, attributes: ['name'] }],
      order: [['tanggal', 'ASC']]
    });

    res.json({
      success: true,
      message: 'Data laporan berhasil dimuat',
      data,
      total: data.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
