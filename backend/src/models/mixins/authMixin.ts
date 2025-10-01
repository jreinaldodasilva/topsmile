import bcrypt from 'bcrypt';
import { Document } from 'mongoose';

export interface AuthMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  incLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  isLocked(): boolean;
}

export interface AuthDocument extends Document {
  password: string;
  loginAttempts: number;
  lockUntil?: Date;
  lastLogin?: Date;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  isLocked(): boolean;
}

export const authMixin = {
  methods: {
    comparePassword: async function(this: AuthDocument, candidatePassword: string): Promise<boolean> {
      return bcrypt.compare(candidatePassword, this.password);
    },

    incLoginAttempts: async function(this: AuthDocument): Promise<void> {
      // If we have a previous lock that has expired, reset attempts
      if (this.lockUntil && this.lockUntil < new Date()) {
        this.loginAttempts = 0;
        this.lockUntil = undefined;
      }

      this.loginAttempts += 1;

      let lockTime = 0; // in milliseconds
      const MAX_ATTEMPTS_SHORT_LOCK = 5;
      const MAX_ATTEMPTS_MEDIUM_LOCK = 10;

      if (this.loginAttempts >= MAX_ATTEMPTS_MEDIUM_LOCK) {
        lockTime = 24 * 60 * 60 * 1000; // 24 hours
      } else if (this.loginAttempts >= MAX_ATTEMPTS_SHORT_LOCK) {
        lockTime = 1 * 60 * 60 * 1000; // 1 hour
      }

      if (lockTime > 0) {
        this.lockUntil = new Date(Date.now() + lockTime);
      }

      await this.save();
    },

    resetLoginAttempts: async function(this: AuthDocument): Promise<void> {
      this.loginAttempts = 0;
      this.lockUntil = undefined;
      await this.save();
    },

    isLocked: function(this: AuthDocument): boolean {
      return !!(this.lockUntil && this.lockUntil > new Date());
    }
  },

  statics: {
    async hashPassword(password: string): Promise<string> {
      const salt = await bcrypt.genSalt(12);
      return bcrypt.hash(password, salt);
    }
  },

  // Common schema fields for authentication
  fields: {
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date
    },
    lastLogin: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }
};