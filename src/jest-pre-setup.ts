import 'whatwg-fetch';
import 'web-streams-polyfill/dist/polyfill';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
(global as any).BroadcastChannel = function () {
  return {
    postMessage: () => {},
    close: () => {},
    onmessage: () => {},
    onmessageerror: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  };
};
