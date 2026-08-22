import express from 'express';
import * as laporanController from '../controllers/laporanController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Dashboard stats
router.get('/dashboard/stats', laporanController.getDashboardStats);

// Barang by kategori
router.get('/barang/by-kategori', laporanController.getBarangByKategori);

// Peminjaman report
router.get('/peminjaman/report', authorize('admin', 'kepala_gudang'), laporanController.getPeminjamanReport);

// Inventory report
router.get('/inventory/report', authorize('admin', 'kepala_gudang'), laporanController.getInventoryReport);

export default router;
