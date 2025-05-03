import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

router.get('/', (req, res) => {
    res.send("Hello, TypeScript with Express!");
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

router.use('/auth', authRoutes);

export default router;