import { Request, Response } from 'express';
import Device, { DeviceOS, DeviceStatus } from '../models/device.model';
import mongoose from 'mongoose';

export const addDevice = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id; // Assuming user ID is available from auth middleware
    const { deviceName, os, osVersion, ipAddress } = req.body;

    // Basic validation
    if (!deviceName || !os || !osVersion) {
      return res.status(400).json({ message: 'Missing required device information' });
    }

    // Generate a unique deviceId (in a real app, this might come from the device itself)
    const deviceId = `device-${new mongoose.Types.ObjectId().toHexString()}`;

    // For simplicity, assign a mock subscriptionId. In a real app, this would be linked to a user's active subscription.
    // You would fetch the user's active subscription and use its ID.
    const mockSubscriptionId = new mongoose.Types.ObjectId(); // Placeholder

    const newDevice = new Device({
      userId,
      subscriptionId: mockSubscriptionId,
      deviceName,
      deviceId,
      os: os as DeviceOS,
      osVersion,
      status: DeviceStatus.ACTIVE,
      lastScan: new Date(),
      lastUpdate: new Date(),
      threatCount: 0,
      ipAddress,
    });

    await newDevice.save();

    res.status(201).json({ message: 'Device added successfully', device: newDevice });
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding device', error: error.message });
  }
};

export const deleteDevice = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { id } = req.params;

    const device = await Device.findOneAndDelete({ _id: id, userId });

    if (!device) {
      return res.status(404).json({ message: 'Device not found or not authorized' });
    }

    res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting device', error: error.message });
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { id } = req.params;
    const { deviceName, os, osVersion, ipAddress, status } = req.body;

    const device = await Device.findOneAndUpdate(
      { _id: id, userId },
      { deviceName, os, osVersion, ipAddress, status, lastUpdate: new Date() },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: 'Device not found or not authorized' });
    }

    res.status(200).json({ message: 'Device updated successfully', device });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
};

export const getDevices = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const devices = await Device.find({ userId });
    res.status(200).json({ devices });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
};