import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import familyRoutes from "./routes/familyRoutes"
import contactRoutes from "./routes/contactRoutes"
import billRoutes from './routes/bill';
import monthlyPaymentRoutes from './routes/monthlyPayment';
import familyNoteRoutes from './routes/familyNote';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/family', familyRoutes);
app.use('/contacts', contactRoutes);
app.use('/bills', billRoutes);
app.use('/monthly-payment', monthlyPaymentRoutes);
app.use('/family-notes', familyNoteRoutes);
app.use(errorHandler);

export default app;