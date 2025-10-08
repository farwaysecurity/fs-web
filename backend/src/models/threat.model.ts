import mongoose, { Document, Schema } from 'mongoose';

export enum ThreatSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ThreatType {
  VIRUS = 'virus',
  MALWARE = 'malware',
  RANSOMWARE = 'ransomware',
  SPYWARE = 'spyware',
  TROJAN = 'trojan',
  PHISHING = 'phishing',
  ROOTKIT = 'rootkit',
  OTHER = 'other'
}

export interface IThreat extends Document {
  name: string;
  description: string;
  type: ThreatType;
  severity: ThreatSeverity;
  signatureHash: string;
  detectionDate: Date;
  affectedSystems: string[];
  remediationSteps: string[];
  createdAt: Date;
  updatedAt: Date;
}

const threatSchema = new Schema<IThreat>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(ThreatType),
      required: true
    },
    severity: {
      type: String,
      enum: Object.values(ThreatSeverity),
      required: true
    },
    signatureHash: {
      type: String,
      required: true,
      unique: true
    },
    detectionDate: {
      type: Date,
      default: Date.now
    },
    affectedSystems: [{
      type: String
    }],
    remediationSteps: [{
      type: String
    }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IThreat>('Threat', threatSchema);