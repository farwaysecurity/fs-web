import mongoose, { Document, Schema } from 'mongoose';

export enum DeviceOS {
  WINDOWS = 'windows',
  MACOS = 'macos',
  LINUX = 'linux',
  ANDROID = 'android',
  IOS = 'ios'
}

export enum DeviceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPROMISED = 'compromised'
}

export interface IDevice extends Document {
  userId: mongoose.Types.ObjectId;
  subscriptionId: mongoose.Types.ObjectId;
  deviceName: string;
  deviceId: string;
  os: DeviceOS;
  osVersion: string;
  status: DeviceStatus;
  lastScan: Date;
  lastUpdate: Date;
  threatCount: number;
  ipAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const deviceSchema = new Schema<IDevice>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true
    },
    deviceName: {
      type: String,
      required: true,
      trim: true
    },
    deviceId: {
      type: String,
      required: true,
      unique: true
    },
    os: {
      type: String,
      enum: Object.values(DeviceOS),
      required: true
    },
    osVersion: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(DeviceStatus),
      default: DeviceStatus.ACTIVE
    },
    lastScan: {
      type: Date,
      default: Date.now
    },
    lastUpdate: {
      type: Date,
      default: Date.now
    },
    threatCount: {
      type: Number,
      default: 0
    },
    ipAddress: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IDevice>('Device', deviceSchema);