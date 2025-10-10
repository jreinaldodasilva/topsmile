// Mock MSW server for tests
export const server = {
    listen: jest.fn(),
    close: jest.fn(),
    resetHandlers: jest.fn()
};
