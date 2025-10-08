#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const importMappings = {
  "from '../utils/errors'": "from '../utils/errors/errors'",
  "from '../../utils/errors'": "from '../../utils/errors/errors'",
  "from './utils/errors'": "from './utils/errors/errors'",
  
  "from '../utils/errorLogger'": "from '../utils/errors/errorLogger'",
  "from '../../utils/errorLogger'": "from '../../utils/errors/errorLogger'",
  "from './utils/errorLogger'": "from './utils/errors/errorLogger'",
  
  "from '../utils/cache'": "from '../utils/cache/cache'",
  "from '../../utils/cache'": "from '../../utils/cache/cache'",
  "from './utils/cache'": "from './utils/cache/cache'",
  
  "from '../utils/cacheInvalidation'": "from '../utils/cache/cacheInvalidation'",
  "from '../../utils/cacheInvalidation'": "from '../../utils/cache/cacheInvalidation'",
  "from './utils/cacheInvalidation'": "from './utils/cache/cacheInvalidation'",
  
  "from '../utils/validation'": "from '../utils/validation/validation'",
  "from '../../utils/validation'": "from '../../utils/validation/validation'",
  "from './utils/validation'": "from './utils/validation/validation'",
  
  "from '../utils/validators'": "from '../utils/validation/validators'",
  "from '../../utils/validators'": "from '../../utils/validation/validators'",
  "from './utils/validators'": "from './utils/validation/validators'",
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

console.log('🔄 Updating utility imports...\n');

const srcDir = path.join(__dirname, '../src');
let updatedCount = 0;

walkDirectory(srcDir, (filePath) => {
  if (updateImportsInFile(filePath)) {
    console.log(`✅ Updated: ${path.relative(srcDir, filePath)}`);
    updatedCount++;
  }
});

console.log(`\n✨ Updated ${updatedCount} files\n`);
