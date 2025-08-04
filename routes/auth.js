import express from 'express';
import authController from '../controllers/auth.js';

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

export default router;