import mongoose from 'mongoose';

interface ISecurityHistory {
  user: mongoose.Schema.Types.ObjectId;
  action: string;
  timestamp: Date;
  details?: string;
}

const securityHistorySchema = new mongoose.Schema<ISecurityHistory>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
  },
});

const SecurityHistory = mongoose.model<ISecurityHistory>('SecurityHistory', securityHistorySchema);

export default SecurityHistory;