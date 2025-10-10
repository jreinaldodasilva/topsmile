// MSW v2 requires these polyfills to be available globally before any MSW code runs
if (typeof TransformStream === 'undefined') {
    const { TransformStream } = require('web-streams-polyfill');
    global.TransformStream = TransformStream;
}

if (typeof ReadableStream === 'undefined') {
    const { ReadableStream } = require('web-streams-polyfill');
    global.ReadableStream = ReadableStream;
}

if (typeof WritableStream === 'undefined') {
    const { WritableStream } = require('web-streams-polyfill');
    global.WritableStream = WritableStream;
}
