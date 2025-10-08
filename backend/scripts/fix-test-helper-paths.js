#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixHelperPaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Count directory depth from tests/
  const relativePath = filePath.replace(/.*\/tests\//, '');
  const depth = relativePath.split('/').length - 1;
  
  // Build correct path to helpers
  const helperPath = '../'.repeat(depth) + 'helpers';
  
  // Fix helper imports
  const helperPatterns = [
    /from ['"]\.\.\/\.\.\/helpers\/(testSetup|factories)['"]/g,
    /from ['"]\.\.\/helpers\/(testSetup|factories)['"]/g,
    /from ['"]\.\.\/\.\.\/\.\.\/helpers\/(testSetup|factories)['"]/g
  ];
  
  helperPatterns.forEach(pattern => {
    if (content.match(pattern)) {
      content = content.replace(pattern, `from '${helperPath}/$1'`);
      updated = true;
    }
  });

  // Fix app import depth
  const appDepth = depth + 1;
  const appPath = '../'.repeat(appDepth) + 'src/app';
  if (content.includes("from '../../../src/app'") || content.includes("from '../../src/app'")) {
    content = content.replace(/from ['"]\.\.\/\.\.\/\.\.\/src\/app['"]/g, `from '${appPath}'`);
    content = content.replace(/from ['"]\.\.\/\.\.\/src\/app['"]/g, `from '${appPath}'`);
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
      fixHelperPaths(filePath);
    }
  });
}

const testsDir = path.join(__dirname, '../tests');
console.log('Fixing test helper paths...\n');
walkDir(testsDir);
console.log('\n✓ Helper paths fixed!');
