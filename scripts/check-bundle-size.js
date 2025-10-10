const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BUILD_DIR = path.join(__dirname, '../build/static/js');
const MAX_BUNDLE_SIZE = 250 * 1024; // 250 KB in bytes

function getGzipSize(filePath) {
    const content = fs.readFileSync(filePath);
    const gzipped = zlib.gzipSync(content);
    return gzipped.length;
}

function checkBundleSize() {
    if (!fs.existsSync(BUILD_DIR)) {
        console.error('Build directory not found. Run npm run build first.');
        process.exit(1);
    }

    const files = fs.readdirSync(BUILD_DIR).filter(file => file.endsWith('.js') && file.startsWith('main.'));

    if (files.length === 0) {
        console.error('No main bundle found.');
        process.exit(1);
    }

    const mainBundle = files[0];
    const mainBundlePath = path.join(BUILD_DIR, mainBundle);
    const gzipSize = getGzipSize(mainBundlePath);
    const sizeInKB = (gzipSize / 1024).toFixed(2);

    console.log(`Main bundle size (gzipped): ${sizeInKB} KB`);
    console.log(`Maximum allowed: ${(MAX_BUNDLE_SIZE / 1024).toFixed(2)} KB`);

    if (gzipSize > MAX_BUNDLE_SIZE) {
        console.error(`❌ Bundle size exceeds limit! (${sizeInKB} KB > ${(MAX_BUNDLE_SIZE / 1024).toFixed(2)} KB)`);
        process.exit(1);
    }

    console.log(`✅ Bundle size is within limit (${sizeInKB} KB)`);
}

checkBundleSize();
