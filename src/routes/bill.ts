import { Router } from 'express';
import { addBill, listBills, markBillPaid } from '../controllers/billController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/add', authMiddleware, addBill);
router.get('/:familyId', authMiddleware, listBills);
router.patch('/pay', authMiddleware, markBillPaid);

export default router;
