import express from 'express';
import adminController from '../controllers/admin.js';
import isAuth from '../middleware/is-auth.js';

const router = express.Router();

router.get('/upload', isAuth, adminController.getUpload);
router.post('/upload', isAuth, adminController.postUpload);

export default router;