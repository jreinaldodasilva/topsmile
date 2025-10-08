#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const importMappings = {
  "from './config/database'": "from './config/database/database'",
  "from '../config/database'": "from '../config/database/database'",
  "from '../../config/database'": "from '../../config/database/database'",
  
  "from './config/redis'": "from './config/database/redis'",
  "from '../config/redis'": "from '../config/database/redis'",
  "from '../../config/redis'": "from '../../config/database/redis'",
  
  "from './config/security'": "from './config/security/security'",
  "from '../config/security'": "from '../config/security/security'",
  "from '../../config/security'": "from '../../config/security/security'",
  
  "from './config/permissions'": "from './config/security/permissions'",
  "from '../config/permissions'": "from '../config/security/permissions'",
  "from '../../config/permissions'": "from '../../config/security/permissions'",
  
  "from './config/cdtCodes'": "from './config/clinical/cdtCodes'",
  "from '../config/cdtCodes'": "from '../config/clinical/cdtCodes'",
  "from '../../config/cdtCodes'": "from '../../config/clinical/cdtCodes'",
  
  "from './config/medicalConditions'": "from './config/clinical/medicalConditions'",
  "from '../config/medicalConditions'": "from '../config/clinical/medicalConditions'",
  "from '../../config/medicalConditions'": "from '../../config/clinical/medicalConditions'",
  
  "from './config/noteTemplates'": "from './config/clinical/noteTemplates'",
  "from '../config/noteTemplates'": "from '../config/clinical/noteTemplates'",
  "from '../../config/noteTemplates'": "from '../../config/clinical/noteTemplates'",
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

console.log('🔄 Updating config imports...\n');

const srcDir = path.join(__dirname, '../src');
let updatedCount = 0;

walkDirectory(srcDir, (filePath) => {
  if (updateImportsInFile(filePath)) {
    console.log(`✅ Updated: ${path.relative(srcDir, filePath)}`);
    updatedCount++;
  }
});

console.log(`\n✨ Updated ${updatedCount} files\n`);
