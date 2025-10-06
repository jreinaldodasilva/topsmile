// src/features/clinical/hooks/useDentalChart.ts
import { useState, useCallback } from 'react';
import { dentalChartService } from '../services/dentalChartService';

interface UseDentalChartReturn {
    chart: any | null;
    charts: any[];
    loading: boolean;
    error: string | null;
    getByPatient: (patientId: string) => Promise<void>;
    getLatest: (patientId: string) => Promise<void>;
    create: (data: any) => Promise<void>;
    update: (id: string, data: any) => Promise<void>;
}

export const useDentalChart = (): UseDentalChartReturn => {
    const [chart, setChart] = useState<any | null>(null);
    const [charts, setCharts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getByPatient = useCallback(async (patientId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await dentalChartService.getByPatient(patientId);
            setCharts(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar odontogramas');
        } finally {
            setLoading(false);
        }
    }, []);

    const getLatest = useCallback(async (patientId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await dentalChartService.getLatest(patientId);
            setChart(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar odontograma');
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await dentalChartService.create(data);
            setChart(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao criar odontograma');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const update = useCallback(async (id: string, data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await dentalChartService.update(id, data);
            setChart(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar odontograma');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        chart,
        charts,
        loading,
        error,
        getByPatient,
        getLatest,
        create,
        update
    };
};
