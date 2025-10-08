import { Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User, { UserRole } from '../models/user.model';
import dotenv from 'dotenv';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

// Ensure JWT_SECRET is defined
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Register a new user
export const register = async (req: Request, res: Response) => {
  console.log('Registering user with data:', req.body);
  try {
    const { email, password, firstName, lastName, role, company, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || UserRole.CLIENT,
      company,
      phone,
      twoFactorEnabled: false
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    // Return user data without password
    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      company: user.company,
      phone: user.phone,
      twoFactorEnabled: user.twoFactorEnabled
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userData
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      return res.status(200).json({
        message: 'Please complete two-factor authentication',
        requiresTwoFactor: true,
        userId: user._id
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    // Return user data without password
    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      company: user.company,
      phone: user.phone,
      twoFactorEnabled: user.twoFactorEnabled
    };

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Verify two-factor authentication
export const verifyTwoFactor = async (req: Request, res: Response) => {
  try {
    const { userId, twoFactorCode } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: 'Two-factor authentication not enabled for this user' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: twoFactorCode,
    });

    if (!verified) {
      return res.status(401).json({ message: 'Invalid two-factor code' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      company: user.company,
      phone: user.phone,
      twoFactorEnabled: user.twoFactorEnabled
    };

    res.status(200).json({
      message: 'Two-factor authentication successful',
      token,
      user: userData
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error verifying two-factor code', error: error.message });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is added by auth middleware
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { firstName, lastName, email } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    await user.save();

    const updatedUserData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      company: user.company,
      phone: user.phone,
      twoFactorEnabled: user.twoFactorEnabled
    };

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUserData
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Enable/disable two-factor authentication
export const toggleTwoFactor = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is added by auth middleware
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      // Disable 2FA
      user.twoFactorEnabled = false;
      user.twoFactorSecret = undefined;
      await user.save();
      res.status(200).json({
        message: 'Two-factor authentication disabled successfully',
        twoFactorEnabled: user.twoFactorEnabled,
      });
    } else {
      // Enable 2FA
      const secret = speakeasy.generateSecret({
        length: 20,
        name: 'Farway Security',
      });
      user.twoFactorSecret = secret.base32;
      user.twoFactorEnabled = true;
      await user.save();

      const otpauthUrl = secret.otpauth_url;
      if (otpauthUrl) {
        const qrCodeImage = await qrcode.toDataURL(otpauthUrl);
        res.status(200).json({
          message: 'Two-factor authentication enabled successfully',
          twoFactorEnabled: user.twoFactorEnabled,
          twoFactorSecret: user.twoFactorSecret,
          qrCodeImage: qrCodeImage,
        });
      } else {
        res.status(500).json({ message: 'Failed to generate QR code URL' });
      }
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error toggling two-factor authentication', error: error.message });
  }
};