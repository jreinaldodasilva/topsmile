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

function findInlineTypeDefinitions(content, filePath) {
  const issues = [];
  
  SHARED_TYPES.forEach(typeName => {
    const interfaceRegex = new RegExp(`interface\\s+${typeName}\\s*{`, 'g');
    const typeRegex = new RegExp(`type\\s+${typeName}\\s*=`, 'g');
    
    if (interfaceRegex.test(content) || typeRegex.test(content)) {
      issues.push({
        file: filePath,
        type: typeName,
        issue: 'inline_definition',
        message: `Found inline definition of ${typeName} - should use @topsmile/types`
      });
    }
  });
  
  return issues;
}

function findMissingImports(content, filePath) {
  const issues = [];
  const hasTopsmileImport = content.includes("from '@topsmile/types'");
  
  SHARED_TYPES.forEach(typeName => {
    const typeUsageRegex = new RegExp(`\\b${typeName}\\b`, 'g');
    const matches = content.match(typeUsageRegex);
    
    if (matches && matches.length > 0 && !hasTopsmileImport) {
      const hasLocalDef = content.includes(`interface ${typeName}`) || 
                         content.includes(`type ${typeName}`);
      
      if (!hasLocalDef) {
        issues.push({
          file: filePath,
          type: typeName,
          issue: 'missing_import',
          message: `Uses ${typeName} but doesn't import from @topsmile/types`
        });
      }
    }
  });
  
  return issues;
}

function scanFiles() {
  const allIssues = [];
  const srcFiles = scanDirectory('./src');
  const backendFiles = scanDirectory('./backend/src');
  
  [...srcFiles, ...backendFiles].forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      const inlineIssues = findInlineTypeDefinitions(content, filePath);
      const importIssues = findMissingImports(content, filePath);
      
      allIssues.push(...inlineIssues, ...importIssues);
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error.message);
    }
  });
  
  return allIssues;
}

function generateReport(issues) {
  console.log('\n📊 Shared Types Migration Report\n');
  console.log('='.repeat(50));
  
  if (issues.length === 0) {
    console.log('✅ All files are using shared types correctly!');
    return;
  }
  
  const byType = issues.reduce((acc, issue) => {
    if (!acc[issue.issue]) acc[issue.issue] = [];
    acc[issue.issue].push(issue);
    return acc;
  }, {});
  
  Object.entries(byType).forEach(([issueType, issueList]) => {
    console.log(`\n🔍 ${issueType.toUpperCase().replace('_', ' ')} (${issueList.length} issues):`);
    
    issueList.forEach(issue => {
      console.log(`  ❌ ${issue.file}`);
      console.log(`     ${issue.message}`);
    });
  });
  
  console.log(`\n📈 Summary:`);
  console.log(`  Total issues: ${issues.length}`);
  console.log(`  Files affected: ${new Set(issues.map(i => i.file)).size}`);
  
  const typeUsage = issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {});
  
  console.log(`\n🏷️  Most problematic types:`);
  Object.entries(typeUsage)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count} issues`);
    });
}

console.log('🔍 Scanning for shared types usage...');
const issues = scanFiles();
generateReport(issues);
console.log('\n✨ Scan complete!');