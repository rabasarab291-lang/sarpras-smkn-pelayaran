import { body, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation error',
        errors: errors.array()
      });
    }
    next();
  };
};

export const loginValidation = [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
];

export const registerValidation = [
  body('name').notEmpty().withMessage('Nama tidak boleh kosong'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('role').isIn(['admin', 'user', 'kepala_gudang']).withMessage('Role tidak valid')
];

export const barangValidation = [
  body('nama_barang').notEmpty().withMessage('Nama barang tidak boleh kosong'),
  body('kategori_id').isInt().withMessage('Kategori harus dipilih'),
  body('jumlah').isInt({ min: 0 }).withMessage('Jumlah harus angka positif'),
  body('kondisi').isIn(['baik', 'rusak_ringan', 'rusak_berat']).withMessage('Kondisi tidak valid')
];
