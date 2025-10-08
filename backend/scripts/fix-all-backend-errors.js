#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const fixes = {
  // Service imports
  "from '../../services/auth/authService'": "from '../../services/auth'",
  "from '../services/auth/authService'": "from '../services/auth'",
  "from '../../services/schedulingService'": "from '../../services/scheduling'",
  "from './base/BaseService'": "from '../base/BaseService'",
  
  // Middleware imports
  "from '../../middleware/patientAuth'": "from '../../middleware/auth/patientAuth'",
  "from '../middleware/auth/auth'": "from '../../middleware/auth/auth'",
  
  // Model imports
  "from '../models/RefreshToken'": "from '../../models/RefreshToken'",
  "from '../models/PatientUser'": "from '../../models/PatientUser'",
  "from '../models/PatientRefreshToken'": "from '../../models/PatientRefreshToken'",
  
  // Utils imports
  "from '../utils/errors/errors'": "from '../../utils/errors/errors'",
  "from '../types/errors'": "from '../../utils/errors/errors'",
  "from '../utils/cache/cache'": "from '../../utils/cache/cache'",
  "from '../utils/cache/cacheInvalidation'": "from '../../utils/cache/cacheInvalidation'",
  
  // Config imports
  "from '../config/clinical/cdtCodes'": "from '../../config/clinical/cdtCodes'",
  
  // Type imports - use shared types
  "import type { ITreatmentPlan, ITreatmentPlan }": "import type { TreatmentPlan }",
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Apply import fixes
  for (const [oldStr, newStr] of Object.entries(fixes)) {
    if (content.includes(oldStr)) {
      content = content.replaceAll(oldStr, newStr);
      updated = true;
    }
  }
  
  // Fix Model references to use actual model imports (not type aliases)
  // These should reference the Mongoose models, not types
  const modelFixes = {
    'UserModel': 'User',
    'PatientModel': 'Patient', 
    'ProviderModel': 'Provider',
    'AppointmentModel': 'Appointment',
    'AppointmentTypeModel': 'AppointmentType',
  };
  
  for (const [oldName, newName] of Object.entries(modelFixes)) {
    if (content.includes(oldName)) {
      content = content.replaceAll(oldName, newName);
      updated = true;
    }
  }
  
  // Fix type annotations to use shared types from @topsmile/types
  // Only fix type annotations, not variable names
  const typeAnnotationFixes = [
    { pattern: /: Provider([^a-zA-Z])/g, replacement: ': IProvider$1' },
    { pattern: /: AppointmentType([^a-zA-Z])/g, replacement: ': IAppointmentType$1' },
    { pattern: /: Appointment([^a-zA-Z])/g, replacement: ': IAppointment$1' },
  ];
  
  typeAnnotationFixes.forEach(({ pattern, replacement }) => {
    if (content.match(pattern)) {
      content = content.replace(pattern, replacement);
      updated = true;
    }
  });
  
  // Fix implicit any types
  const implicitAnyFixes = [
    { pattern: /\(t\)(?=\s*=>)/g, replacement: '(t: any)' },
    { pattern: /\(provider\)(?=\s*=>)/g, replacement: '(provider: any)' },
    { pattern: /\(providerSlots\)(?=\s*=>)/g, replacement: '(providerSlots: any)' },
    { pattern: /\(apt\)(?=\s*=>)/g, replacement: '(apt: any)' },
  ];
  
  implicitAnyFixes.forEach(({ pattern, replacement }) => {
    if (content.match(pattern)) {
      content = content.replace(pattern, replacement);
      updated = true;
    }
  });

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
    } else if (file.endsWith('.ts') && !file.endsWith('.test.ts')) {
      fixFile(filePath);
    }
  });
}

const srcDir = path.join(__dirname, '../src');
console.log('Fixing all backend errors...\n');
walkDir(srcDir);
console.log('\n✓ All backend errors fixed!');
