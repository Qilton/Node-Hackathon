import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;