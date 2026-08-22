import express from 'express';
import * as authController from '../controllers/authController.js';
import { validate, loginValidation, registerValidation } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.post('/change-password', authController.changePassword);

export default router;
