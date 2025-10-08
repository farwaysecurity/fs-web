import { Request, Response } from 'express';
import Subscription from '../models/subscription.model';
import User from '../models/user.model';
import Product from '../models/product.model'; // Import Product model

// Placeholder for a more complex billing service integration

export const getSubscriptionDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming req.user is populated by authMiddleware
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found.' });
    }

    const subscription = await Subscription.findOne({ userId }).populate('productId');

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found for this user.' });
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    res.status(500).json({ message: 'Server error while fetching subscription details.' });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found.' });
    }

    const { newPlanId, autoRenew } = req.body; // Example: newPlanId for upgrading/downgrading

    // Validate newPlanId if provided
    if (newPlanId) {
      const product = await Product.findById(newPlanId);
      if (!product) {
        return res.status(404).json({ message: 'New plan (product) not found.' });
      }
    }

    const updatedSubscription = await Subscription.findOneAndUpdate(
      { userId },
      { productId: newPlanId, autoRenew, updatedAt: new Date() },
      { new: true }
    ).populate('productId');

    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found.' });
    }

    res.status(200).json({ message: 'Subscription updated successfully.', subscription: updatedSubscription });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Server error while updating subscription.' });
  }
};

export const updatePaymentMethod = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found.' });
    }

    const { paymentToken } = req.body; // Token from a payment gateway (e.g., Stripe, PayPal)

    // In a real application, this would involve:
    // 1. Sending the paymentToken to the payment gateway to update the customer's payment method
    // 2. Storing a reference to the new payment method in your user or billing model (not sensitive data)

    // For now, we'll just simulate success
    res.status(200).json({ message: 'Payment method updated successfully.' });
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ message: 'Server error while updating payment method.' });
  }
};

export const getInvoiceHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found.' });
    }

    // In a real application, this would involve fetching invoices from a payment gateway
    // or from a local database if you store invoice records.

    const mockInvoices = [
      { id: 'inv_001', date: '2023-05-01', amount: 9.99, currency: 'USD', status: 'Paid', downloadUrl: '/api/invoices/inv_001/download' },
      { id: 'inv_002', date: '2023-06-01', amount: 9.99, currency: 'USD', status: 'Paid', downloadUrl: '/api/invoices/inv_002/download' },
    ];

    res.status(200).json(mockInvoices);
  } catch (error) {
    console.error('Error fetching invoice history:', error);
    res.status(500).json({ message: 'Server error while fetching invoice history.' });
  }
};