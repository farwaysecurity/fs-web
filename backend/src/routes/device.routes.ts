import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { addDevice, deleteDevice, updateDevice, getDevices } from '../controllers/device.controller';

const router = express.Router();

// Add a new device (protected route)
router.post('/add', protect, addDevice);
router.delete('/:id', protect, deleteDevice);
router.put('/:id', protect, updateDevice);
router.get('/all', protect, getDevices);

export default router;