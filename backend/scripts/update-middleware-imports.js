#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const importMappings = {
  "from './middleware/auth'": "from './middleware/auth/auth'",
  "from '../middleware/auth'": "from '../middleware/auth/auth'",
  "from '../../middleware/auth'": "from '../../middleware/auth/auth'",
  
  "from './middleware/patientAuth'": "from './middleware/auth/patientAuth'",
  "from '../middleware/patientAuth'": "from '../middleware/auth/patientAuth'",
  "from '../../middleware/patientAuth'": "from '../../middleware/auth/patientAuth'",
  
  "from './middleware/mfaVerification'": "from './middleware/auth/mfaVerification'",
  "from '../middleware/mfaVerification'": "from '../middleware/auth/mfaVerification'",
  "from '../../middleware/mfaVerification'": "from '../../middleware/auth/mfaVerification'",
  
  "from './middleware/permissions'": "from './middleware/auth/permissions'",
  "from '../middleware/permissions'": "from '../middleware/auth/permissions'",
  "from '../../middleware/permissions'": "from '../../middleware/auth/permissions'",
  
  "from './middleware/roleBasedAccess'": "from './middleware/auth/roleBasedAccess'",
  "from '../middleware/roleBasedAccess'": "from '../middleware/auth/roleBasedAccess'",
  "from '../../middleware/roleBasedAccess'": "from '../../middleware/auth/roleBasedAccess'",
  
  "from './middleware/security'": "from './middleware/security/security'",
  "from '../middleware/security'": "from '../middleware/security/security'",
  "from '../../middleware/security'": "from '../../middleware/security/security'",
  
  "from './middleware/rateLimiter'": "from './middleware/security/rateLimiter'",
  "from '../middleware/rateLimiter'": "from '../middleware/security/rateLimiter'",
  "from '../../middleware/rateLimiter'": "from '../../middleware/security/rateLimiter'",
  
  "from './middleware/passwordPolicy'": "from './middleware/security/passwordPolicy'",
  "from '../middleware/passwordPolicy'": "from '../middleware/security/passwordPolicy'",
  "from '../../middleware/passwordPolicy'": "from '../../middleware/security/passwordPolicy'",
  
  "from './middleware/validation'": "from './middleware/validation/validation'",
  "from '../middleware/validation'": "from '../middleware/validation/validation'",
  "from '../../middleware/validation'": "from '../../middleware/validation/validation'",
};

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  for (const [oldImport, newImport] of Object.entries(importMappings)) {
    if (content.includes(oldImport)) {
      content = content.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        walkDirectory(filePath, callback);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      callback(filePath);
    }
  });
}

console.log('🔄 Updating middleware imports...\n');

const srcDir = path.join(__dirname, '../src');
let updatedCount = 0;

walkDirectory(srcDir, (filePath) => {
  if (updateImportsInFile(filePath)) {
    console.log(`✅ Updated: ${path.relative(srcDir, filePath)}`);
    updatedCount++;
  }
});

console.log(`\n✨ Updated ${updatedCount} files\n`);
