#!/usr/bin/env node

const crypto = require('crypto');

/**
 * Generate secure secrets for TopSmile application
 */

console.log('🔐 TopSmile Secret Generator');
console.log('============================\n');

// Generate JWT secrets (64 characters / 32 bytes)
const jwtSecret = crypto.randomBytes(32).toString('hex');
const patientJwtSecret = crypto.randomBytes(32).toString('hex');

console.log('📋 Copy these to your .env file:\n');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`PATIENT_JWT_SECRET=${patientJwtSecret}\n`);

console.log('🔧 For production deployment:');
console.log('- Store these in your secret management system');
console.log('- Never commit these to version control');
console.log('- Rotate secrets regularly\n');

console.log('✅ Secrets generated successfully!');