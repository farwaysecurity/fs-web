import mongoose, { Document, Schema } from 'mongoose';

export enum ProductType {
  ANTIVIRUS = 'antivirus',
  ENDPOINT = 'endpoint',
  SECURITY_SUITE = 'security_suite'
}

export enum ProductTier {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export interface IProduct extends Document {
  name: string;
  description: string;
  type: ProductType;
  tier: ProductTier;
  price: number;
  features: string[];
  downloadLinks: {
    windows?: string;
    mac?: string;
    linux?: string;
  };
  version: string;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
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
      enum: Object.values(ProductType),
      required: true
    },
    tier: {
      type: String,
      enum: Object.values(ProductTier),
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    features: [{
      type: String,
      required: true
    }],
    downloadLinks: {
      windows: String,
      mac: String,
      linux: String
    },
    version: {
      type: String,
      required: true
    },
    releaseDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IProduct>('Product', productSchema);