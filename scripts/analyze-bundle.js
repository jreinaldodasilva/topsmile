const fs = require('fs');
const path = require('path');

function analyzeBundle() {
  const buildDir = path.join(__dirname, '../build/static/js');
  
  if (!fs.existsSync(buildDir)) {
    console.log('Build directory not found. Run "npm run build" first.');
    return;
  }

  const files = fs.readdirSync(buildDir);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  
  console.log('\n=== Bundle Analysis ===\n');
  
  let totalSize = 0;
  const fileStats = jsFiles.map(file => {
    const filePath = path.join(buildDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;
    
    return { file, size: stats.size, sizeKB };
  }).sort((a, b) => b.size - a.size);

  fileStats.forEach(({ file, sizeKB }) => {
    const warning = parseFloat(sizeKB) > 500 ? ' ⚠️  LARGE' : '';
    console.log(`${file}: ${sizeKB} KB${warning}`);
  });

  console.log(`\nTotal JS Size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`Total JS Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (totalSize / 1024 > 1000) {
    console.log('\n⚠️  Bundle size exceeds 1MB. Consider code splitting.');
  }
  
  console.log('\nRecommendations:');
  console.log('- Use lazy loading for routes');
  console.log('- Split large components');
  console.log('- Remove unused dependencies');
  console.log('- Use tree shaking');
}

analyzeBundle();
