import { Router } from 'express';
import { getProfile, getUserId } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/profile', authMiddleware, getProfile);
router.get('/id', authMiddleware, getUserId);

export default router;
