import { Router } from 'express';
import { getSample, createSample } from '../controllers/sampleController';

const router = Router();

router.get('/', getSample);
router.post('/', createSample);

export default router;