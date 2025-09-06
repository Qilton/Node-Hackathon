import { Router } from 'express';
import { updateMonthlyPayment } from '../controllers/monthlyPaymentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.patch('/update', authMiddleware, updateMonthlyPayment);

export default router;
