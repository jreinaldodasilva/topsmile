import crypto from 'crypto';

/**
 * Secure test utilities for handling sensitive test data
 */

export const generateSecureTestPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const generateSecureTestSecret = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const maskSensitiveData = (data: any): any => {
  if (typeof data === 'string') {
    return data.length > 4 ? `${data.substring(0, 2)}***${data.substring(data.length - 2)}` : '***';
  }
  
  if (Array.isArray(data)) {
    return data.map(maskSensitiveData);
  }
  
  if (typeof data === 'object' && data !== null) {
    const masked: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (['password', 'secret', 'token', 'key'].some(sensitive => key.toLowerCase().includes(sensitive))) {
        masked[key] = maskSensitiveData(value);
      } else {
        masked[key] = value;
      }
    }
    return masked;
  }
  
  return data;
};

export const createTestCredentials = () => ({
  password: generateSecureTestPassword(),
  secret: generateSecureTestSecret(),
  apiKey: generateSecureTestSecret(24)
});