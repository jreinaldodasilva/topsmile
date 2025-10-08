#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const importFixes = {
  // Auth route
  "from '../../../src/routes/security/auth'": "from '../../../src/routes/security'",
  
  // Pagination util
  "from '../../src/utils/pagination'": "from '../../../src/utils/validation/pagination'",
  "from '../../../src/utils/pagination'": "from '../../../src/utils/validation/pagination'",
};

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  for (const [oldImport, newImport] of Object.entries(importFixes)) {
    if (content.includes(oldImport)) {
      content = content.replaceAll(oldImport, newImport);
      updated = true;
    }
  }

  // Fix createTestUser calls with 2 arguments
  if (content.includes('await createTestUser(testClinic,')) {
    content = content.replace(/await createTestUser\(testClinic,\s*\{/g, 'await createTestUser({clinic: testClinic._id,');
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
      fixImports(filePath);
    }
  });
}

const testsDir = path.join(__dirname, '../tests');
console.log('Fixing remaining test imports...\n');
walkDir(testsDir);
console.log('\n✓ Remaining imports fixed!');
