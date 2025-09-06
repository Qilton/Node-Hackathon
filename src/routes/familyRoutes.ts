import { Router } from 'express';
import { createFamily, generateFamilyCode, joinFamilyWithCode, kickFamilyMember } from '../controllers/familyController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/create', authMiddleware, createFamily);
router.post('/:familyId/code', authMiddleware, generateFamilyCode);
router.post('/join', authMiddleware, joinFamilyWithCode);
router.post('/kick', authMiddleware, kickFamilyMember);

export default router;
