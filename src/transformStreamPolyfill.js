// Polyfill for TransformStream (needed for MSW in Node.js test environment)
const { TransformStream } = require('web-streams-polyfill');
global.TransformStream = TransformStream;
console.log('TransformStream polyfill loaded:', typeof global.TransformStream);
console.log('TransformStream:', TransformStream);
console.log('global.TransformStream:', global.TransformStream);
console.log('TransformStream in global:', 'TransformStream' in global);
