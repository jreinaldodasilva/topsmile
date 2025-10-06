// src/features/providers/hooks/useProviders.ts
import { useState, useCallback } from 'react';
import { providerService } from '../services/providerService';

export const useProviders = () => {
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getProviders = useCallback(async (params?: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await providerService.getProviders(params);
            setProviders(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar profissionais');
        } finally {
            setLoading(false);
        }
    }, []);

    return { providers, loading, error, getProviders };
};
