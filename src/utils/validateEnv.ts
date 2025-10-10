// src/utils/validateEnv.ts
const requiredEnvVars = [
  'REACT_APP_API_URL'
];

const optionalEnvVars = [
  'REACT_APP_STRIPE_PUBLISHABLE_KEY',
  'REACT_APP_ENABLE_ANALYTICS',
  'REACT_APP_ENABLE_DEBUG'
];

export const validateEnv = (): void => {
  const missing: string[] = [];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      `Please check your .env file and ensure all required variables are set.`
    );
  }

  // Validate API URL format
  const apiUrl = process.env.REACT_APP_API_URL;
  if (apiUrl && !apiUrl.startsWith('http')) {
    throw new Error('REACT_APP_API_URL must start with http:// or https://');
  }
};

export const getEnv = (key: string, defaultValue?: string): string => {
  return process.env[key] || defaultValue || '';
};
