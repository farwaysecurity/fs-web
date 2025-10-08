import { Request, Response } from 'express';
import SecurityHistory from '../models/securityHistory.model';
import { AuthenticatedRequest } from '../types/express';

// @desc    Get security history for a user
// @route   GET /api/security-history
// @access  Private
export const getSecurityHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized, no user ID' });
    }

    const history = await SecurityHistory.find({ user: userId }).sort({ timestamp: -1 });
    res.status(200).json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new security event
// @route   POST /api/security-history
// @access  Private (admin or internal service)
export const addSecurityEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { action, details } = req.body;
    const userId = req.user?.id;

    if (!userId || !action) {
      return res.status(400).json({ message: 'Please provide user ID and action' });
    }

    const newEvent = await SecurityHistory.create({
      user: userId,
      action,
      details,
    });

    res.status(201).json(newEvent);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};