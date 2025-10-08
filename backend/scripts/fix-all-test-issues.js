#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const fixes = [
  // Fix service imports that don't exist
  {
    pattern: /from '\.\.\/\.\.\/\.\.\/src\/services\/patient\/patientService'/g,
    replacement: "from '../../../src/services/patient'"
  },
  {
    pattern: /from '\.\.\/\.\.\/\.\.\/src\/services\/provider\/providerService'/g,
    replacement: "from '../../../src/services/provider'"
  },
  {
    pattern: /from '\.\.\/\.\.\/\.\.\/src\/services\/scheduling\/appointmentService'/g,
    replacement: "from '../../../src/services/scheduling'"
  },
  // Fix possibly undefined clinic
  {
    pattern: /clinicId = user\.clinic\.toString\(\);/g,
    replacement: "clinicId = user.clinic?.toString() || '';"
  },
  {
    pattern: /const clinicId = created\.clinic\.toString\(\);/g,
    replacement: "const clinicId = created.clinic?.toString() || '';"
  },
  // Fix appointment factory usage in integration tests
  {
    pattern: /const appointment = createTestAppointment\(/g,
    replacement: "const appointment = await Appointment.create(createTestAppointment("
  },
  {
    pattern: /appointment\._id/g,
    replacement: "appointment._id"
  }
];

function applyFixes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  fixes.forEach(fix => {
    if (content.match(fix.pattern)) {
      content = content.replace(fix.pattern, fix.replacement);
      updated = true;
    }
  });

  // Add Appointment import if using createTestAppointment and it's not imported
  if (content.includes('await Appointment.create') && !content.includes("from '../../src/models/Appointment'") && !content.includes("from '../../../src/models/Appointment'")) {
    const importMatch = content.match(/^import .+ from ['"].*['"];$/m);
    if (importMatch) {
      const depth = filePath.includes('/integration/') ? '../../../' : '../../';
      content = content.replace(importMatch[0], `${importMatch[0]}\nimport { Appointment } from '${depth}src/models/Appointment';`);
      updated = true;
    }
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
      applyFixes(filePath);
    }
  });
}

const testsDir = path.join(__dirname, '../tests');
console.log('Fixing all test issues...\n');
walkDir(testsDir);
console.log('\n✓ All test issues fixed!');
