import { Schema } from 'mongoose';

export interface BaseRefreshTokenFields {
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  deviceInfo?: {
    userAgent?: string;
    ip?: string;
    platform?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export function createRefreshTokenSchema(userField: string, userRef: string) {
  const schema = new Schema({
    token: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    [userField]: { 
      type: Schema.Types.ObjectId, 
      ref: userRef, 
      required: true, 
      index: true 
    },
    expiresAt: { 
      type: Date, 
      required: true 
    },
    isRevoked: { 
      type: Boolean, 
      default: false, 
      index: true 
    },
    deviceInfo: {
      userAgent: String,
      ip: String,
      platform: String
    }
  }, { 
    timestamps: true 
  });

  // Common indexes
  schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  schema.index({ [userField]: 1, isRevoked: 1 });
  schema.index({ token: 1, isRevoked: 1 });

  return schema;
}