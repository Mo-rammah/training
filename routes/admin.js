import express from 'express';
import adminController from '../controllers/admin.js';
import isAuth from '../middleware/is-auth.js';

const router = express.Router();

router.get('/upload', isAuth, adminController.getUpload);
router.post('/upload', isAuth, adminController.postUpload);

router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.post('/logout', adminController.postLogout);

router.get('/register', adminController.getRegister);
router.post('/register', adminController.postRegister);

export default router;