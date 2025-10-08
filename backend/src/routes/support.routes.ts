import express from 'express';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Create a new support ticket (protected route)
router.post('/', protect, (req, res) => {
  res.status(201).json({ message: 'Create new support ticket', data: req.body });
});

// Get a support ticket by ID (protected route)
router.get('/:id', protect, (req, res) => {
  res.status(200).json({ message: `Get support ticket with ID: ${req.params.id}` });
});

export default router;