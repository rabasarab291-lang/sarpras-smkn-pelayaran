import express from 'express';
import * as barangController from '../controllers/barangController.js';
import { validate, barangValidation } from '../middleware/validation.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Create - hanya admin dan kepala gudang
router.post('/', authorize('admin', 'kepala_gudang'), validate(barangValidation), barangController.createBarang);

// Read
router.get('/', barangController.getBarangs);
router.get('/:id', barangController.getBarangById);

// Update - hanya admin dan kepala gudang
router.put('/:id', authorize('admin', 'kepala_gudang'), barangController.updateBarang);

// Delete - hanya admin
router.delete('/:id', authorize('admin'), barangController.deleteBarang);

export default router;
