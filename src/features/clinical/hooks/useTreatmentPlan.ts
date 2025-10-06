// src/features/clinical/hooks/useTreatmentPlan.ts
import { useState, useCallback } from 'react';
import { treatmentPlanService } from '../services/treatmentPlanService';

interface UseTreatmentPlanReturn {
    plan: any | null;
    plans: any[];
    loading: boolean;
    error: string | null;
    getByPatient: (patientId: string) => Promise<void>;
    getById: (id: string) => Promise<void>;
    create: (data: any) => Promise<void>;
    update: (id: string, data: any) => Promise<void>;
    accept: (id: string, acceptedBy: string) => Promise<void>;
    updatePhaseStatus: (id: string, phaseNumber: number, status: string) => Promise<void>;
}

export const useTreatmentPlan = (): UseTreatmentPlanReturn => {
    const [plan, setPlan] = useState<any | null>(null);
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getByPatient = useCallback(async (patientId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await treatmentPlanService.getByPatient(patientId);
            setPlans(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar planos de tratamento');
        } finally {
            setLoading(false);
        }
    }, []);

    const getById = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await treatmentPlanService.getById(id);
            setPlan(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar plano de tratamento');
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await treatmentPlanService.create(data);
            setPlan(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao criar plano de tratamento');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const update = useCallback(async (id: string, data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await treatmentPlanService.update(id, data);
            setPlan(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar plano de tratamento');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const accept = useCallback(async (id: string, acceptedBy: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await treatmentPlanService.accept(id, acceptedBy);
            setPlan(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao aceitar plano de tratamento');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePhaseStatus = useCallback(async (id: string, phaseNumber: number, status: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await treatmentPlanService.updatePhaseStatus(id, phaseNumber, status);
            setPlan(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar fase');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        plan,
        plans,
        loading,
        error,
        getByPatient,
        getById,
        create,
        update,
        accept,
        updatePhaseStatus
    };
};
