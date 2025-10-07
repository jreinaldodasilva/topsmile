#!/usr/bin/env node
// scripts/generate-env-secrets.js
const crypto = require('crypto');

console.log('🔐 TopSmile - Environment Secrets Generator\n');
console.log('Copy these values to your .env file:\n');
console.log('='.repeat(70));

const secrets = {
  JWT_SECRET: crypto.randomBytes(32).toString('hex'),
  JWT_REFRESH_SECRET: crypto.randomBytes(32).toString('hex'),
  PATIENT_JWT_SECRET: crypto.randomBytes(32).toString('hex'),
};

Object.entries(secrets).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log('='.repeat(70));
console.log('\n✅ All secrets are 64 characters (32 bytes in hex)');
console.log('⚠️  NEVER commit these values to version control');
console.log('💡 Use different secrets for each environment\n');
