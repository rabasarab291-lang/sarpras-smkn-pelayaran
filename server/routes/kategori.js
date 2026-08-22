import express from 'express';
import * as kategoriController from '../controllers/kategoriController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Create - hanya admin
router.post('/', authorize('admin'), kategoriController.createKategori);

// Read
router.get('/', kategoriController.getKategoris);
router.get('/:id', kategoriController.getKategoriById);

// Update - hanya admin
router.put('/:id', authorize('admin'), kategoriController.updateKategori);

// Delete - hanya admin
router.delete('/:id', authorize('admin'), kategoriController.deleteKategori);

export default router;
