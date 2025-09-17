// Mock MSW to avoid TextEncoder issues
const mockSetupServer = jest.fn(() => ({
  listen: jest.fn(),
  close: jest.fn(),
  resetHandlers: jest.fn(),
  use: jest.fn(),
}));

export const setupServer = mockSetupServer;
export const http = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};
export const HttpResponse = {
  json: jest.fn(),
};
export const graphql = {
  query: jest.fn(),
  mutation: jest.fn(),
};
