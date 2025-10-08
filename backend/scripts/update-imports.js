#!/usr/bin/env node

/**
 * Script to update service imports across the codebase
 * Converts old import paths to new organized structure
 */

const fs = require('fs');
const path = require('path');

const importMappings = {
  // Auth services
  "from '../services/authService'": "from '../services/auth/authService'",
  "from '../../services/authService'": "from '../../services/auth/authService'",
  "from './services/authService'": "from './services/auth/authService'",
  "from '../services/patientAuthService'": "from '../services/auth/patientAuthService'",
  "from '../../services/patientAuthService'": "from '../../services/auth/patientAuthService'",
  "from './services/patientAuthService'": "from './services/auth/patientAuthService'",
  "from '../services/mfaService'": "from '../services/auth/mfaService'",
  "from '../../services/mfaService'": "from '../../services/auth/mfaService'",
  "from './services/mfaService'": "from './services/auth/mfaService'",
  "from '../services/sessionService'": "from '../services/auth/sessionService'",
  "from '../../services/sessionService'": "from '../../services/auth/sessionService'",
  "from './services/sessionService'": "from './services/auth/sessionService'",
  "from '../services/tokenBlacklistService'": "from '../services/auth/tokenBlacklistService'",
  "from '../../services/tokenBlacklistService'": "from '../../services/auth/tokenBlacklistService'",
  "from './services/tokenBlacklistService'": "from './services/auth/tokenBlacklistService'",
  
  // Clinical services
  "from '../services/treatmentPlanService'": "from '../services/clinical/treatmentPlanService'",
  "from '../../services/treatmentPlanService'": "from '../../services/clinical/treatmentPlanService'",
  "from './services/treatmentPlanService'": "from './services/clinical/treatmentPlanService'",
  
  // External services
  "from '../services/emailService'": "from '../services/external/emailService'",
  "from '../../services/emailService'": "from '../../services/external/emailService'",
  "from './services/emailService'": "from './services/external/emailService'",
  "from '../services/smsService'": "from '../services/external/smsService'",
  "from '../../services/smsService'": "from '../../services/external/smsService'",
  "from './services/smsService'": "from './services/external/smsService'",
  
  // Patient services
  "from '../services/patientService'": "from '../services/patient/patientService'",
  "from '../../services/patientService'": "from '../../services/patient/patientService'",
  "from './services/patientService'": "from './services/patient/patientService'",
  "from '../services/familyService'": "from '../services/patient/familyService'",
  "from '../../services/familyService'": "from '../../services/patient/familyService'",
  "from './services/familyService'": "from './services/patient/familyService'",
  
  // Scheduling services
  "from '../services/appointmentService'": "from '../services/scheduling/appointmentService'",
  "from '../../services/appointmentService'": "from '../../services/scheduling/appointmentService'",
  "from './services/appointmentService'": "from './services/scheduling/appointmentService'",
  "from '../services/appointmentTypeService'": "from '../services/scheduling/appointmentTypeService'",
  "from '../../services/appointmentTypeService'": "from '../../services/scheduling/appointmentTypeService'",
  "from './services/appointmentTypeService'": "from './services/scheduling/appointmentTypeService'",
  "from '../services/availabilityService'": "from '../services/scheduling/availabilityService'",
  "from '../../services/availabilityService'": "from '../../services/scheduling/availabilityService'",
  "from './services/availabilityService'": "from './services/scheduling/availabilityService'",
  "from '../services/bookingService'": "from '../services/scheduling/bookingService'",
  "from '../../services/bookingService'": "from '../../services/scheduling/bookingService'",
  "from './services/bookingService'": "from './services/scheduling/bookingService'",
  "from '../services/schedulingService'": "from '../services/scheduling/schedulingService'",
  "from '../../services/schedulingService'": "from '../../services/scheduling/schedulingService'",
  "from './services/schedulingService'": "from './services/scheduling/schedulingService'",
  
  // Admin services
  "from '../services/contactService'": "from '../services/admin/contactService'",
  "from '../../services/contactService'": "from '../../services/admin/contactService'",
  "from './services/contactService'": "from './services/admin/contactService'",
  "from '../services/auditService'": "from '../services/admin/auditService'",
  "from '../../services/auditService'": "from '../../services/admin/auditService'",
  "from './services/auditService'": "from './services/admin/auditService'",
  
  // Provider services
  "from '../services/providerService'": "from '../services/provider/providerService'",
  "from '../../services/providerService'": "from '../../services/provider/providerService'",
  "from './services/providerService'": "from './services/provider/providerService'",
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

console.log('🔄 Updating service imports...\n');

const srcDir = path.join(__dirname, '../src');
let updatedCount = 0;

walkDirectory(srcDir, (filePath) => {
  if (updateImportsInFile(filePath)) {
    console.log(`✅ Updated: ${path.relative(srcDir, filePath)}`);
    updatedCount++;
  }
});

console.log(`\n✨ Updated ${updatedCount} files`);
console.log('\n📝 Next: Run tests to verify everything works');
console.log('   npm test\n');
