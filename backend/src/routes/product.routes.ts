import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { getProducts, createProduct } from '../controllers/product.controller';

const router = express.Router();

// Get all products (protected route)
router.get('/', protect, getProducts);

// Create a new product (protected route, admin only)
router.post('/', protect, createProduct);

// Get a single product by ID (protected route)
router.get('/:id', protect, (req, res) => {
  res.status(200).json({ message: `Get product with ID: ${req.params.id}` });
});

// Create a new product (protected route, admin only)
router.post('/', protect, (req, res) => {
  res.status(200).json({ message: 'Create product' });
});

export default router;