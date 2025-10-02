import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { server } from '../../mocks/server';
import { rest } from 'msw';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false, cacheTime: 0 },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    result.current.login.mutate({
      email: 'test@example.com',
      password: 'password123'
    });

    await waitFor(() => {
      expect(result.current.login.isSuccess).toBe(true);
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle login error', async () => {
    server.use(
      rest.post('/api/auth/login', (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ error: 'Invalid credentials' }));
      })
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    result.current.login.mutate({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    await waitFor(() => {
      expect(result.current.login.isError).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // First login
    result.current.login.mutate({
      email: 'test@example.com',
      password: 'password123'
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Then logout
    result.current.logout.mutate();

    await waitFor(() => {
      expect(result.current.logout.isSuccess).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
});