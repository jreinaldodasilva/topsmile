#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const fixes = {
  // Error logger path
  "from '../../src/utils/errorLogger'": "from '../../src/utils/errors/errorLogger'",
  "from '../../../src/utils/errorLogger'": "from '../../../src/utils/errors/errorLogger'",
  
  // Patient routes path
  "from '../../src/routes/patients'": "from '../../src/routes/patient'",
  "from '../../../src/routes/patients'": "from '../../../src/routes/patient'",
  
  // Errors path
  "from '../../src/utils/errors'": "from '../../src/utils/errors/errors'",
  "from '../../../src/utils/errors'": "from '../../../src/utils/errors/errors'",
  
  // Cache path
  "from '../../src/utils/cache'": "from '../../src/utils/cache/cache'",
  "from '../../../src/utils/cache'": "from '../../../src/utils/cache/cache'",
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Apply import fixes
  for (const [oldPath, newPath] of Object.entries(fixes)) {
    if (content.includes(oldPath)) {
      content = content.replaceAll(oldPath, newPath);
      updated = true;
    }
  }

  // Fix BaseService test - add await
  if (filePath.includes('BaseService.test.ts')) {
    content = content.replace(/const result = createTestPatient\(/g, 'const result = await createTestPatient(');
    content = content.replace(/const found = createTestPatient\(/g, 'const found = await createTestPatient(');
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
      fixFile(filePath);
    }
  });
}

const testsDir = path.join(__dirname, '../tests');
console.log('Applying final test fixes...\n');
walkDir(testsDir);
console.log('\n✓ Final fixes applied!');
