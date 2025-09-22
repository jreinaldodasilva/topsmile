#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Types that should be imported from @topsmile/types
const SHARED_TYPES = [
  'User', 'Contact', 'Patient', 'Appointment', 'Provider', 'Clinic',
  'ApiResult', 'ContactFilters', 'ContactListResponse', 'DashboardStats',
  'CreatePatientDTO', 'CreateAppointmentDTO', 'LoginRequest', 'RegisterRequest',
  'AppointmentType', 'FormTemplate', 'FormResponse'
];

function scanDirectory(dir, pattern = /\.(ts|tsx)$/) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !['node_modules', 'build', 'dist', 'coverage'].includes(item)) {
        scan(fullPath);
      } else if (stat.isFile() && pattern.test(item)) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

function fixTypeImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;
    
    // Check if file already has @topsmile/types import
    const hasTopsmileImport = content.includes("from '@topsmile/types'");
    
    // Find types used in the file
    const usedTypes = [];
    SHARED_TYPES.forEach(typeName => {
      const typeUsageRegex = new RegExp(`\\b${typeName}\\b`, 'g');
      const matches = content.match(typeUsageRegex);
      
      if (matches && matches.length > 0) {
        const hasLocalDef = content.includes(`interface ${typeName}`) || 
                           content.includes(`type ${typeName}`);
        
        if (!hasLocalDef && !usedTypes.includes(typeName)) {
          usedTypes.push(typeName);
        }
      }
    });
    
    // Add import if types are used but not imported
    if (usedTypes.length > 0 && !hasTopsmileImport) {
      const importStatement = `import type { ${usedTypes.join(', ')} } from '@topsmile/types';\n`;
      
      // Find the best place to insert the import
      const lines = content.split('\n');
      let insertIndex = 0;
      
      // Look for existing imports
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          insertIndex = i + 1;
        } else if (lines[i].trim() === '' && insertIndex > 0) {
          break;
        }
      }
      
      lines.splice(insertIndex, 0, importStatement);
      newContent = lines.join('\n');
      hasChanges = true;
    }
    
    // Write back if changes were made
    if (hasChanges) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed imports in: ${filePath}`);
      console.log(`   Added types: ${usedTypes.join(', ')}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Fixing type imports...\n');
  
  const srcFiles = scanDirectory('./src');
  const backendFiles = scanDirectory('./backend/src');
  
  let fixedCount = 0;
  
  [...srcFiles, ...backendFiles].forEach(filePath => {
    if (fixTypeImports(filePath)) {
      fixedCount++;
    }
  });
  
  console.log(`\n✨ Fixed imports in ${fixedCount} files!`);
}

if (require.main === module) {
  main();
}