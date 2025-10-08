import mongoose, { Document, Schema } from 'mongoose';
import { ProductTier } from './product.model';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELED = 'canceled',
  PENDING = 'pending'
}

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  licenseKey: string;
  tier: ProductTier;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  maxDevices: number;
  activeDevices: number;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    licenseKey: {
      type: String,
      required: true,
      unique: true
    },
    tier: {
      type: String,
      enum: Object.values(ProductTier),
      required: true
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.ACTIVE
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    endDate: {
      type: Date,
      required: true
    },
    maxDevices: {
      type: Number,
      required: true,
      default: 1
    },
    activeDevices: {
      type: Number,
      default: 0
    },
    autoRenew: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ISubscription>('Subscription', subscriptionSchema);