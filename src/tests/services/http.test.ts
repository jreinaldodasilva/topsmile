import { request, logout, API_BASE_URL } from '../../services/http';

// Mock localStorage with proper implementation
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock fetch properly for this test suite
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('http service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    mockFetch.mockClear();
  });

  describe('request function', () => {
    describe('successful requests', () => {
      it('should make successful GET request without auth', async () => {
        const mockResponse = { data: { message: 'success' } };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () => JSON.stringify(mockResponse)
        });

        const result = await request('/test-endpoint', { auth: false });

        expect(result.ok).toBe(true);
        expect(result.status).toBe(200);
        expect(result.data).toEqual(mockResponse);
      });

      it('should make successful POST request with auth', async () => {
        const mockResponse = { data: { id: '123' } };
        const accessToken = 'test-access-token';
        localStorageMock.setItem('topsmile_access_token', accessToken);

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          text: async () => JSON.stringify(mockResponse)
        });

        const result = await request('/test-endpoint', {
          method: 'POST',
          body: JSON.stringify({ name: 'test' })
        });

        expect(result.ok).toBe(true);
        expect(result.data).toEqual(mockResponse);
      });

      it('should handle full URL endpoints', async () => {
        const fullUrl = 'https://external-api.com/test';
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ data: 'external' })
        });

        const result = await request(fullUrl);
        expect(result.ok).toBe(true);
      });
    });

    describe('error handling', () => {
      it('should handle HTTP errors', async () => {
        const errorResponse = { message: 'Not found' };
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          text: async () => JSON.stringify(errorResponse)
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
          text: async () => 'not json'
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

        localStorageMock.setItem('topsmile_access_token', expiredToken);
        localStorageMock.setItem('topsmile_refresh_token', refreshToken);

        // First call returns 401
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 401,
          text: async () => JSON.stringify({ message: 'Unauthorized' })
        });

        // Refresh call succeeds
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({
            data: { accessToken: newToken, refreshToken: 'new-refresh' }
          })
        });

        // Retry call succeeds
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ data: { success: true } })
        });

        const result = await request('/protected-endpoint');

        expect(result.ok).toBe(true);
        expect(localStorageMock.getItem('topsmile_access_token')).toBe(newToken);
      });

      it('should handle refresh failure', async () => {
        localStorageMock.setItem('topsmile_access_token', 'expired');
        localStorageMock.setItem('topsmile_refresh_token', 'refresh');

        // Original request fails
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 401,
          text: async () => JSON.stringify({ message: 'Unauthorized' })
        });

        // Refresh fails
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          text: async () => JSON.stringify({ message: 'Invalid refresh token' })
        });

        await expect(request('/protected-endpoint')).rejects.toThrow();
        expect(localStorageMock.getItem('topsmile_access_token')).toBeNull();
      });

      it('should handle concurrent refresh requests', async () => {
        localStorageMock.setItem('topsmile_access_token', 'expired');
        localStorageMock.setItem('topsmile_refresh_token', 'refresh');

        // Setup mock responses
        mockFetch
          .mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: async () => JSON.stringify({ message: 'Unauthorized' })
          })
          .mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: async () => JSON.stringify({ message: 'Unauthorized' })
          })
          .mockResolvedValueOnce({
            ok: true,
            status: 200,
            text: async () => JSON.stringify({
              data: { accessToken: 'new-token', refreshToken: 'new-refresh' }
            })
          })
          .mockResolvedValue({
            ok: true,
            status: 200,
            text: async () => JSON.stringify({ data: { success: true } })
          });

        const [result1, result2] = await Promise.all([
          request('/endpoint1'),
          request('/endpoint2')
        ]);

        expect(result1.ok).toBe(true);
        expect(result2.ok).toBe(true);
      });
    });
  });

  describe('logout function', () => {
    it('should notify backend about logout', async () => {
      const refreshToken = 'test-refresh-token';
      localStorageMock.setItem('topsmile_refresh_token', refreshToken);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true })
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
    });
  });
});
