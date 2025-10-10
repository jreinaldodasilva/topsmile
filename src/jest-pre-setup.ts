import 'whatwg-fetch';
import 'web-streams-polyfill/dist/polyfill';

// Polyfill TextEncoder and TextDecoder for MSW
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

(global as any).BroadcastChannel = function () {
    return {
        postMessage: () => {},
        close: () => {},
        onmessage: () => {},
        onmessageerror: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {}
    };
};
