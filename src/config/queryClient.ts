import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 3,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true
        },
        mutations: {
            retry: 1,
            onError: (error: any) => {
                console.error('Mutation error:', error.message || 'Erro ao processar solicitação');
            }
        }
    }
});
