import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import './tests/utils/customMatchers';

// Setup MSW server for tests
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });

  // Silence console.error for known React warnings during tests
  const originalError = console.error;
  console.error = (...args: any) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') ||
       args[0].includes('ReactDOMTestUtils') ||
       args[0].includes('act()'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});

// Close server after all tests
afterAll(() => {
  server.close();
});

// Mock localStorage with proper implementation
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    length: Object.keys(store).length,
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Other global mocks...
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, 'alert', {
  writable: true,
  value: jest.fn(),
});
