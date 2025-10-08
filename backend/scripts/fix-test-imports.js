#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const importMappings = {
  // Services
  "from '../../../src/services/appointmentService'": "from '../../../src/services/scheduling/appointmentService'",
  "from '../../../src/services/patientService'": "from '../../../src/services/patient/patientService'",
  "from '../../../src/services/providerService'": "from '../../../src/services/provider/providerService'",
  "from '../../../src/services/authService'": "from '../../../src/services/auth/authService'",
  
  // Routes
  "from '../../../src/routes/patients'": "from '../../../src/routes/patient/patients'",
  "from '../../../src/routes/appointments'": "from '../../../src/routes/scheduling/appointments'",
  "from '../../../src/routes/auth'": "from '../../../src/routes/security/auth'",
  
  // Middleware
  "from '../../../src/middleware/auth'": "from '../../../src/middleware/auth/auth'",
  "from '../../middleware/auth'": "from '../../middleware/auth/auth'",
  
  // App import fix
  "import { app } from '../../../src/app'": "import app from '../../../src/app'"
};

function updateImports(filePath) {
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
    console.log(`✓ Updated: ${filePath}`);
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
      updateImports(filePath);
    }
  });
}

const testsDir = path.join(__dirname, '../tests');
console.log('Fixing test imports...\n');
walkDir(testsDir);
console.log('\n✓ Test imports fixed!');
