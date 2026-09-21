import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import documentRoutes from './documentRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/documents', documentRoutes);

export default router;
