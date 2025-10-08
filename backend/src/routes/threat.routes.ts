import express from 'express';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Get all threats (protected route)
router.get('/', protect, (req, res) => {
  res.status(200).json({ message: 'Get all threats' });
});

export default router;