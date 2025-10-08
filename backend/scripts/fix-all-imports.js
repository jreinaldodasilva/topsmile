#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const importMappings = {
  // Routes to middleware
  "from '../middleware/auth/auth'": "from '../../middleware/auth/auth'",
  "from '../middleware/auth'": "from '../../middleware/auth'",
  
  // Routes to models
  "from '../models/": "from '../../models/",
  
  // Routes to services
  "from '../services/": "from '../../services/",
  
  // Routes to config
  "from '../config/": "from '../../config/",
};

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  for (const [oldImport, newImport] of Object.entries(importMappings)) {
    const regex = new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newImport);
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

console.log('🔄 Fixing all import paths...\n');

const routesDir = path.join(__dirname, '../src/routes');
let updatedCount = 0;

walkDirectory(routesDir, (filePath) => {
  if (updateImportsInFile(filePath)) {
    console.log(`✅ Updated: ${path.relative(routesDir, filePath)}`);
    updatedCount++;
  }
});

console.log(`\n✨ Updated ${updatedCount} files\n`);
