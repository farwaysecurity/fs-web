import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';
import { IThreat } from './threat.model';

export interface IScanReport extends Document {
  deviceId: mongoose.Types.ObjectId;
  deviceName: string;
  scanDate: Date;
  status: 'completed' | 'failed';
  threatsFound: number;
  threats: IThreat[]; // Array of threat IDs or embedded threat objects
  scanLog: {
    timestamp: Date;
    message: string;
    level: 'info' | 'warning' | 'error';
  }[];
  duration: number; // in milliseconds
  scannedPaths: string[];
  // Potentially add more fields like: 
  // userId: mongoose.Types.ObjectId;
  // scanType: 'full' | 'quick' | 'custom';
}

const scanReportSchema = new Schema<IScanReport>(
  {
    deviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    scanDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['completed', 'failed'],
      required: true,
    },
    threatsFound: {
      type: Number,
      default: 0,
    },
    threats: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Threat',
      },
    ],
    scanLog: [
      {
        timestamp: { type: Date, default: Date.now },
        message: { type: String, required: true },
        level: { type: String, enum: ['info', 'warning', 'error'], default: 'info' },
      },
    ],
    duration: {
      type: Number,
      required: true,
    },
    scannedPaths: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IScanReport>('ScanReport', scanReportSchema);