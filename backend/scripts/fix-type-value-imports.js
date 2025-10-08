#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Models that need both type and value imports
const MODELS_NEEDING_BOTH = [
  'User', 'Patient', 'Appointment', 'Provider', 'Clinic',
  'Contact', 'AppointmentType', 'MedicalHistory', 'Insurance',
  'TreatmentPlan', 'ClinicalNote', 'Prescription', 'DentalChart',
  'ConsentForm', 'Operatory', 'Waitlist', 'Session', 'AuditLog'
];

function fixTypeValueImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // For each model, check if it's used as a value (Mongoose model)
  MODELS_NEEDING_BOTH.forEach(modelName => {
    // Check if model is used as value (e.g., User.findById, new User(), etc.)
    const usedAsValue = new RegExp(`\\b${modelName}\\.(find|findById|findOne|create|updateOne|deleteOne|countDocuments|aggregate)|new\\s+${modelName}\\(`).test(content);
    
    if (usedAsValue) {
      // Check if there's a type-only import from @topsmile/types
      const typeImportPattern = new RegExp(`import\\s+type\\s+{[^}]*\\b${modelName}\\b[^}]*}\\s+from\\s+['"]@topsmile/types['"]`);
      
      if (typeImportPattern.test(content)) {
        // Need to add model import
        const modelImportExists = new RegExp(`import\\s+{[^}]*\\b${modelName}\\b[^}]*}\\s+from\\s+['"].*models/${modelName}['"]`).test(content);
        
        if (!modelImportExists) {
          // Add model import
          const importSection = content.match(/^(import[^;]+;?\n)+/m);
          if (importSection) {
            const newImport = `import { ${modelName} } from '../../models/${modelName}';\n`;
            content = content.replace(importSection[0], importSection[0] + newImport);
            updated = true;
          }
        }
        
        // Rename type import to avoid conflict
        content = content.replace(
          new RegExp(`(import\\s+type\\s+{[^}]*)(\\b${modelName}\\b)([^}]*}\\s+from\\s+['"]@topsmile/types['"])`, 'g'),
          `$1${modelName} as I${modelName}$3`
        );
        
        // Update type usage in code
        content = content.replace(
          new RegExp(`(:\\s*)(${modelName})(\\s*[|&;,)\\]}>])`, 'g'),
          `$1I$2$3`
        );
        
        updated = true;
      }
    }
  });
  
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

console.log('🔄 Fixing type/value import conflicts...\n');

const srcDir = path.join(__dirname, '../src');
let updatedCount = 0;

['routes', 'services', 'middleware'].forEach(dir => {
  const fullPath = path.join(srcDir, dir);
  if (fs.existsSync(fullPath)) {
    walkDirectory(fullPath, (filePath) => {
      if (fixTypeValueImports(filePath)) {
        console.log(`✅ Fixed: ${path.relative(srcDir, filePath)}`);
        updatedCount++;
      }
    });
  }
});

console.log(`\n✨ Fixed ${updatedCount} files\n`);
