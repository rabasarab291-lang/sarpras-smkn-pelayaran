import express from 'express';
import * as peminjamanController from '../controllers/peminjamanController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Create peminjaman
router.post('/', peminjamanController.createPeminjaman);

// Get all peminjamans
router.get('/', peminjamanController.getPeminjamans);

// Return barang
router.post('/:id/return', authorize('admin', 'kepala_gudang'), peminjamanController.returnBarang);

// Delete peminjaman - hanya admin
router.delete('/:id', authorize('admin'), peminjamanController.deletePeminjaman);

export default router;
