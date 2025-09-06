import { Router } from 'express';
import { addFamilyNote, listFamilyNotes, editFamilyNote, deleteFamilyNote } from '../controllers/familyNoteController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();


router.post('/add', authMiddleware, addFamilyNote);
router.get('/:familyId', authMiddleware, listFamilyNotes);
router.patch('/edit', authMiddleware, editFamilyNote);
router.delete('/delete', authMiddleware, deleteFamilyNote);

export default router;
