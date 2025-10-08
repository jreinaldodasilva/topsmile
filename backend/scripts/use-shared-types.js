#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Types that should come from @topsmile/types
const SHARED_TYPES = [
  'Patient', 'CreatePatientDTO',
  'User',
  'Appointment', 'CreateAppointmentDTO',
  'Provider',
  'Clinic',
  'Contact', 'ContactFilters', 'ContactListResponse',
  'AppointmentType',
  'MedicalHistory', 'CreateMedicalHistoryDTO',
  'Insurance', 'CreateInsuranceDTO',
  'TreatmentPlan', 'CreateTreatmentPlanDTO',
  'ClinicalNote', 'CreateClinicalNoteDTO',
  'Prescription', 'CreatePrescriptionDTO',
  'DentalChart', 'CreateDentalChartDTO',
  'ConsentForm', 'CreateConsentFormDTO',
  'FormTemplate', 'FormResponse', 'CreateFormResponse',
  'Operatory',
  'Waitlist',
  'Session',
  'AuditLog',
  'ApiResult', 'Pagination',
  'DashboardStats',
  'HealthStatus',
  'LoginRequest', 'LoginResponse',
  'RegisterRequest', 'RefreshTokenRequest', 'RefreshTokenResponse',
  'TimeSlot', 'AvailabilityQuery',
  'CalendarEvent', 'CreateCalendarEventRequest',
  'WorkingHours'
];

function updateFileToUseSharedTypes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Check if file already imports from @topsmile/types
  const hasSharedImport = /@topsmile\/types/.test(content);
  
  // Find local type imports that should be shared
  const localTypePattern = /import\s+(?:type\s+)?{([^}]+)}\s+from\s+['"]\.\.\/(?:\.\.\/)?models\/(\w+)['"]/g;
  let match;
  const typesToImport = new Set();
  
  while ((match = localTypePattern.exec(content)) !== null) {
    const importedTypes = match[1].split(',').map(t => t.trim().replace(/^type\s+/, ''));
    const modelName = match[2];
    
    importedTypes.forEach(type => {
      // Check if this type should come from shared types
      if (SHARED_TYPES.includes(type) || SHARED_TYPES.includes(modelName)) {
        typesToImport.add(type);
      }
    });
  }
  
  if (typesToImport.size > 0) {
    // Add or update @topsmile/types import
    const sharedTypesImport = `import type { ${Array.from(typesToImport).join(', ')} } from '@topsmile/types';`;
    
    if (hasSharedImport) {
      // Update existing import
      content = content.replace(
        /import\s+type\s+{[^}]+}\s+from\s+['"]@topsmile\/types['"]/,
        (match) => {
          // Merge with existing types
          const existingTypes = match.match(/{([^}]+)}/)[1]
            .split(',')
            .map(t => t.trim());
          const allTypes = new Set([...existingTypes, ...typesToImport]);
          return `import type { ${Array.from(allTypes).join(', ')} } from '@topsmile/types'`;
        }
      );
    } else {
      // Add new import at the top after other imports
      const importSection = content.match(/^(import[^;]+;?\n)+/m);
      if (importSection) {
        content = content.replace(
          importSection[0],
          importSection[0] + sharedTypesImport + '\n'
        );
      } else {
        content = sharedTypesImport + '\n' + content;
      }
    }
    
    // Remove local model imports for types now in shared
    typesToImport.forEach(type => {
      const removePattern = new RegExp(
        `import\\s+(?:type\\s+)?{[^}]*\\b${type}\\b[^}]*}\\s+from\\s+['"]\\.\\.\/(?:\\.\\.\/)?models\/\\w+['"];?\\n?`,
        'g'
      );
      content = content.replace(removePattern, '');
    });
    
    updated = true;
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
      if (!file.includes('node_modules') && !file.includes('.git') && file !== 'models') {
        walkDirectory(filePath, callback);
      }
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      callback(filePath);
    }
  });
}

console.log('🔄 Updating files to use shared types...\n');

const srcDir = path.join(__dirname, '../src');
let updatedCount = 0;

// Process routes, services, and middleware
['routes', 'services', 'middleware'].forEach(dir => {
  const fullPath = path.join(srcDir, dir);
  if (fs.existsSync(fullPath)) {
    walkDirectory(fullPath, (filePath) => {
      if (updateFileToUseSharedTypes(filePath)) {
        console.log(`✅ Updated: ${path.relative(srcDir, filePath)}`);
        updatedCount++;
      }
    });
  }
});

console.log(`\n✨ Updated ${updatedCount} files to use shared types\n`);
