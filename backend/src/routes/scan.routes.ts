import express from 'express';
import { runScan, getScanReports } from '../controllers/scan.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/run', protect, runScan);
router.get('/', protect, getScanReports);

export default router;