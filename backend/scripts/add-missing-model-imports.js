#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const modelImports = {
  'User': "import { User } from '../../models/User';",
  'Patient': "import { Patient } from '../../models/Patient';",
  'Provider': "import { Provider } from '../../models/Provider';",
  'Appointment': "import { Appointment } from '../../models/Appointment';",
  'AppointmentType': "import { AppointmentType } from '../../models/AppointmentType';",
  'Clinic': "import { Clinic } from '../../models/Clinic';",
};

function addMissingImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Find where imports end
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex === -1) return;
  
  // Check which models are used but not imported
  const neededImports = [];
  
  for (const [modelName, importStatement] of Object.entries(modelImports)) {
    // Check if model is used in code
    const modelUsagePattern = new RegExp(`\\b${modelName}\\.(find|create|update|delete|findOne|findById|aggregate|countDocuments)`, 'g');
    const newPattern = new RegExp(`new ${modelName}\\(`, 'g');
    
    if ((content.match(modelUsagePattern) || content.match(newPattern)) && 
        !content.includes(`import { ${modelName} }`)) {
      neededImports.push(importStatement);
      updated = true;
    }
  }
  
  if (updated && neededImports.length > 0) {
    // Insert imports after last import
    lines.splice(lastImportIndex + 1, 0, ...neededImports);
    content = lines.join('\n');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Added imports to: ${filePath}`);
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
      addMissingImports(filePath);
    }
  });
}

const srcDir = path.join(__dirname, '../src');
console.log('Adding missing model imports...\n');
walkDir(srcDir);
console.log('\n✓ Model imports added!');
