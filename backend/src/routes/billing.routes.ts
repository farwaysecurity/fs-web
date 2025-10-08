import express from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getSubscriptionDetails,
  updateSubscription,
  updatePaymentMethod,
  getInvoiceHistory,
} from '../controllers/billing.controller';

const router = express.Router();

// Get subscription details for the authenticated user
router.get('/subscription', protect, getSubscriptionDetails);

// Update subscription for the authenticated user
router.put('/subscription', protect, updateSubscription);

// Update payment method for the authenticated user
router.put('/payment-method', protect, updatePaymentMethod);

// Get invoice history for the authenticated user
router.get('/invoices', protect, getInvoiceHistory);

export default router;