import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import familyRoutes from "./routes/familyRoutes"
import contactRoutes from "./routes/contactRoutes"
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/family', familyRoutes);
app.use('/contacts', contactRoutes);
// Global error handler (should be after routes)
app.use(errorHandler);

export default app;