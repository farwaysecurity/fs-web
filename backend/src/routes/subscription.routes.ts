import express from 'express';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Get all subscriptions (protected route)
router.get('/', protect, (req, res) => {
  res.status(200).json({ message: 'Get all subscriptions' });
});

// Create a new subscription (protected route)
router.post('/', protect, (req, res) => {
  res.status(201).json({ message: 'Create new subscription', data: req.body });
});

export default router;