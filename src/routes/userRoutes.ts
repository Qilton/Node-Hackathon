import { Router } from 'express';
import { getProfile, getUserId, getUserIdByUsername } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/profile', authMiddleware, getProfile);
router.get('/id', authMiddleware, getUserId);
router.get('/id/:username', authMiddleware, getUserIdByUsername);

export default router;
