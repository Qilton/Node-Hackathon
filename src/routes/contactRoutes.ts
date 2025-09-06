import { Router } from 'express';
import { addContact, listContacts, updateContactNotes, deleteContact } from '../controllers/contactController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/add', authMiddleware, addContact);
router.get('/:familyId', authMiddleware, listContacts);
router.patch('/notes', authMiddleware, updateContactNotes);
router.delete('/delete', authMiddleware, deleteContact);

export default router;
