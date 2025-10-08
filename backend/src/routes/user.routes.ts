import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { getProfile } from '../controllers/auth.controller';

const router = express.Router();

// Get user profile (protected route)
router.get('/profile', protect, getProfile);

export default router;