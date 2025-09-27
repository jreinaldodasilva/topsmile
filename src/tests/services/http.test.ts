import { request, logout, API_BASE_URL } from '../../services/http';

// Create a clean localStorage mock
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
};

// Mock localStorage
const mockLocalStorage = createLocalStorageMock();
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('http service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    mockFetch.mockReset();
  });

  describe('request function', () => {
    describe('successful requests', () => {
      it('should make successful GET request without auth', async () => {
        const mockResponse = { data: { message: 'success' } };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: jest.fn().mockResolvedValue(JSON.stringify(mockResponse))
        });

        const result = await request('/test-endpoint', { auth: false });

        expect(result.ok).toBe(true);
        expect(result.status).toBe(200);
        expect(result.data).toEqual(mockResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          `${API_BASE_URL}/test-endpoint`,
          expect.objectContaining({
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            })
          })
        );
      });

      it('should make successful POST request with auth', async () => {
        const mockResponse = { data: { id: '123' } };
        const accessToken = 'test-access-token';
        mockLocalStorage.setItem('topsmile_access_token', accessToken);

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          text: jest.fn().mockResolvedValue(JSON.stringify(mockResponse))
        });

        const result = await request('/test-endpoint', {
          method: 'POST',
          body: JSON.stringify({ name: 'test' })
        });

        expect(result.ok).toBe(true);
        expect(result.data).toEqual(mockResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          `${API_BASE_URL}/test-endpoint`,
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }),
            body: JSON.stringify({ name: 'test' })
          })
        );
      });

      it('should handle full URL endpoints', async () => {
        const fullUrl = 'https://external-api.com/test';
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: jest.fn().mockResolvedValue(JSON.stringify({ data: 'external' }))
        });

        const result = await request(fullUrl);

        expect(result.ok).toBe(true);
        expect(mockFetch).toHaveBeenCalledWith(fullUrl, expect.any(Object));
      });
    });

    describe('error handling', () => {
      it('should handle HTTP errors', async () => {
        const errorResponse = { message: 'Not found' };
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
          text: jest.fn().mockResolvedValue(JSON.stringify(errorResponse))
        });

        const result = await request('/not-found');

        expect(result.ok).toBe(false);
        expect(result.status).toBe(404);
        expect(result.message).toBe('Not found');
      });

      it('should handle malformed JSON responses', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: jest.fn().mockResolvedValue('not json')
        });

        const result = await request('/malformed');

        expect(result.ok).toBe(true);
        expect(result.data).toEqual({ message: 'not json' });
      });
    });

    describe('token refresh', () => {
      it('should refresh token on 401 and retry request', async () => {
        const expiredToken = 'expired-token';
        const newToken = 'new-access-token';
        const refreshToken = 'refresh-token';

        mockLocalStorage.setItem('topsmile_access_token', expiredToken);
        mockLocalStorage.setItem('topsmile_refresh_token', refreshToken);

        // First call returns 401
        mockFetch
          .mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: jest.fn().mockResolvedValue(JSON.stringify({ message: 'Unauthorized' }))
          })
          // Refresh call succeeds
          .mockResolvedValueOnce({
            ok: true,
            status: 200,
            text: jest.fn().mockResolvedValue(JSON.stringify({
              data: { accessToken: newToken, refreshToken: 'new-refresh' }
            }))
          })
          // Retry call succeeds
          .mockResolvedValueOnce({
            ok: true,
            status: 200,
            text: jest.fn().mockResolvedValue(JSON.stringify({ data: { success: true } }))
          });

        const result = await request('/protected-endpoint');

        expect(result.ok).toBe(true);
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('topsmile_access_token', newToken);
        expect(mockFetch).toHaveBeenCalledTimes(3);
      });

      it('should handle refresh failure', async () => {
        mockLocalStorage.setItem('topsmile_access_token', 'expired');
        mockLocalStorage.setItem('topsmile_refresh_token', 'refresh');

        // Original request fails
        mockFetch
          .mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: jest.fn().mockResolvedValue(JSON.stringify({ message: 'Unauthorized' }))
          })
          // Refresh fails
          .mockResolvedValueOnce({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            text: jest.fn().mockResolvedValue(JSON.stringify({ message: 'Invalid refresh token' }))
          });

        await expect(request('/protected-endpoint')).rejects.toThrow('Invalid refresh token');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('topsmile_access_token');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('topsmile_refresh_token');
      });

      it('should handle concurrent refresh requests', async () => {
        mockLocalStorage.setItem('topsmile_access_token', 'expired');
        mockLocalStorage.setItem('topsmile_refresh_token', 'refresh');

        // Setup mock responses
        mockFetch
          .mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: jest.fn().mockResolvedValue(JSON.stringify({ message: 'Unauthorized' }))
          })
          .mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: jest.fn().mockResolvedValue(JSON.stringify({ message: 'Unauthorized' }))
          })
          .mockResolvedValueOnce({
            ok: true,
            status: 200,
            text: jest.fn().mockResolvedValue(JSON.stringify({
              data: { accessToken: 'new-token', refreshToken: 'new-refresh' }
            }))
          })
          .mockResolvedValue({
            ok: true,
            status: 200,
            text: jest.fn().mockResolvedValue(JSON.stringify({ data: { success: true } }))
          });

        const [result1, result2] = await Promise.all([
          request('/endpoint1'),
          request('/endpoint2')
        ]);

        expect(result1.ok).toBe(true);
        expect(result2.ok).toBe(true);
        // Should only refresh once
        expect(mockFetch).toHaveBeenCalledTimes(5); // 2 initial + 1 refresh + 2 retry
      });
    });
  });

  describe('logout function', () => {
    it('should notify backend about logout', async () => {
      const refreshToken = 'test-refresh-token';
      mockLocalStorage.setItem('topsmile_refresh_token', refreshToken);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ success: true }))
      });

      await logout();

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/auth/logout`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        })
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('topsmile_access_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('topsmile_refresh_token');
    });

    it('should handle backend logout failure gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Should not throw
      await expect(logout()).resolves.not.toThrow();
    });
  });
});
