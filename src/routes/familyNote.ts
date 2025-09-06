import { Router } from 'express';
import { addFamilyNote, listFamilyNotes } from '../controllers/familyNoteController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/add', authMiddleware, addFamilyNote);
router.get('/:familyId', authMiddleware, listFamilyNotes);

export default router;
