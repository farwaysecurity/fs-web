import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { getSecurityHistory, addSecurityEvent } from '../controllers/securityHistory.controller';

const router = express.Router();

// Get security history for the authenticated user
router.get('/', protect, getSecurityHistory);

// Add a new security event (protected route, likely for internal use or admin)
router.post('/', protect, addSecurityEvent);

export default router;