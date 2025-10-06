// src/features/patients/hooks/usePatient.ts
import { useState, useCallback } from 'react';
import { patientService } from '../services/patientService';

interface UsePatientReturn {
    patient: any | null;
    patients: any[];
    stats: any | null;
    loading: boolean;
    error: string | null;
    search: (params: any) => Promise<void>;
    getById: (id: string) => Promise<void>;
    create: (data: any) => Promise<void>;
    update: (id: string, data: any) => Promise<void>;
    updateMedicalHistory: (id: string, medicalHistory: any) => Promise<void>;
    deletePatient: (id: string) => Promise<void>;
    reactivate: (id: string) => Promise<void>;
    getStats: () => Promise<void>;
}

export const usePatient = (): UsePatientReturn => {
    const [patient, setPatient] = useState<any | null>(null);
    const [patients, setPatients] = useState<any[]>([]);
    const [stats, setStats] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = useCallback(async (params: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await patientService.search(params);
            setPatients(response.data.patients || response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar pacientes');
        } finally {
            setLoading(false);
        }
    }, []);

    const getById = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await patientService.getById(id);
            setPatient(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar paciente');
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await patientService.create(data);
            setPatient(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao criar paciente');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const update = useCallback(async (id: string, data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await patientService.update(id, data);
            setPatient(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar paciente');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMedicalHistory = useCallback(async (id: string, medicalHistory: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await patientService.updateMedicalHistory(id, medicalHistory);
            setPatient(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar histórico médico');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deletePatient = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await patientService.delete(id);
            setPatient(null);
        } catch (err: any) {
            setError(err.message || 'Erro ao excluir paciente');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reactivate = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await patientService.reactivate(id);
            setPatient(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao reativar paciente');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await patientService.getStats();
            setStats(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar estatísticas');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        patient,
        patients,
        stats,
        loading,
        error,
        search,
        getById,
        create,
        update,
        updateMedicalHistory,
        deletePatient,
        reactivate,
        getStats
    };
};
