// backend/src/config/env.ts
import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  nodeEnv: string;
  port: number;
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
  jwt: {
    secret: string;
    refreshSecret: string;
    patientSecret: string;
    expiresIn: string;
    patientExpiresIn: string;
    refreshExpiresDays: number;
  };
  frontend: {
    url: string;
    adminUrl?: string;
  };
  email: {
    from: string;
    admin: string;
    sendgridApiKey?: string;
    etherealUser?: string;
    etherealPass?: string;
  };
  sms: {
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    twilioPhoneNumber?: string;
  };
  security: {
    cookieSecure: boolean;
    trustProxy: boolean;
    verifyUserOnRequest: boolean;
  };
  rateLimit: {
    apiWindowMs: number;
    apiMax: number;
    contactWindowMs: number;
    contactMax: number;
  };
  logging: {
    level: string;
    enableRequestLogging: boolean;
    detailedErrors: boolean;
  };
  features: {
    mockEmailService: boolean;
    mockSmsService: boolean;
  };
}

const getEnvConfig = (): EnvConfig => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    
    database: {
      url: process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/topsmile',
    },
    
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    
    jwt: {
      secret: process.env.JWT_SECRET || 'development-jwt-secret',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'development-refresh-secret',
      patientSecret: process.env.PATIENT_JWT_SECRET || 'development-patient-jwt-secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      patientExpiresIn: process.env.PATIENT_ACCESS_TOKEN_EXPIRES || '24h',
      refreshExpiresDays: parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '7', 10),
    },
    
    frontend: {
      url: process.env.FRONTEND_URL || 'http://localhost:3000',
      adminUrl: process.env.ADMIN_URL,
    },
    
    email: {
      from: process.env.FROM_EMAIL || 'noreply@topsmile.com',
      admin: process.env.ADMIN_EMAIL || 'contato@topsmile.com',
      sendgridApiKey: process.env.SENDGRID_API_KEY,
      etherealUser: process.env.ETHEREAL_USER,
      etherealPass: process.env.ETHEREAL_PASS,
    },
    
    sms: {
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
      twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
    
    security: {
      cookieSecure: process.env.COOKIE_SECURE === 'true',
      trustProxy: process.env.TRUST_PROXY === '1' || process.env.NODE_ENV === 'production',
      verifyUserOnRequest: process.env.VERIFY_USER_ON_REQUEST === 'true',
    },
    
    rateLimit: {
      apiWindowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || '900000', 10),
      apiMax: parseInt(process.env.API_RATE_LIMIT_MAX || '100', 10),
      contactWindowMs: parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || '900000', 10),
      contactMax: parseInt(process.env.CONTACT_RATE_LIMIT_MAX || '5', 10),
    },
    
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'false',
      detailedErrors: process.env.DETAILED_ERRORS === 'true',
    },
    
    features: {
      mockEmailService: process.env.MOCK_EMAIL_SERVICE === 'true',
      mockSmsService: process.env.MOCK_SMS_SERVICE === 'true',
    },
  };
};

export const env = getEnvConfig();

export const validateEnv = (): void => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (env.nodeEnv === 'production') {
    // Required in production
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 64) {
      errors.push('JWT_SECRET must be at least 64 characters in production');
    }
    
    if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 64) {
      errors.push('JWT_REFRESH_SECRET must be at least 64 characters in production');
    }
    
    if (!process.env.PATIENT_JWT_SECRET || process.env.PATIENT_JWT_SECRET.length < 64) {
      errors.push('PATIENT_JWT_SECRET must be at least 64 characters in production');
    }
    
    if (!env.database.url.startsWith('mongodb://') && !env.database.url.startsWith('mongodb+srv://')) {
      errors.push('DATABASE_URL must be a valid MongoDB connection string');
    }
    
    if (!env.email.sendgridApiKey) {
      errors.push('SENDGRID_API_KEY is required in production');
    }
    
    if (!env.security.cookieSecure) {
      warnings.push('COOKIE_SECURE should be true in production');
    }
    
    if (env.logging.detailedErrors) {
      warnings.push('DETAILED_ERRORS should be false in production to avoid leaking sensitive information');
    }
  } else {
    // Development warnings
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key') {
      warnings.push('JWT_SECRET not set or using insecure default');
    }
    
    if (!env.email.sendgridApiKey && !env.email.etherealUser) {
      warnings.push('No email service configured (SendGrid or Ethereal)');
    }
  }

  if (errors.length > 0) {
    console.error('❌ Environment Configuration Errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Invalid environment configuration');
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Environment Configuration Warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
};

export default env;
