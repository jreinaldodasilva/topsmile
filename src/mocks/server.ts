// Conditionally import MSW only in non-test environments
let server;

if (process.env.NODE_ENV !== 'test') {
  const { setupServer } = require('msw/node');
  const { handlers } = require('./handlers');
  server = setupServer(...handlers);
} else {
  // In test environment, provide a mock server
  server = {
    listen: jest.fn(),
    close: jest.fn(),
    resetHandlers: jest.fn(),
  };
}

export { server };
