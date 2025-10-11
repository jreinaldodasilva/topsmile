import { useState, useCallback } from 'react';
import { usePatients, useDeletePatient } from './queries';
import { useAuth } from '../contexts/AuthContext';
import type { Patient } from '../../packages/types/src/index';


interface PatientFilters {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

interface PaginatedPatientsResponse {
    patients: Patient[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export const usePatientManagement = () => {
    const { user } = useAuth();
    const [filters, setFilters] = useState<PatientFilters>({
        search: '',
        isActive: true,
        page: 1,
        limit: 20
    });
    const [sort, setSort] = useState<Record<string, any>>({ createdAt: -1 });

    const { data, isLoading, error, refetch } = usePatients(user?.clinicId || '', { ...filters, sort });
    const deleteMutation = useDeletePatient();

    const patients = data?.patients || [];
    const total = data?.total || 0;
    const totalPages = data?.totalPages || 0;
    const hasNext = data?.hasNext || false;
    const hasPrev = data?.hasPrev || false;

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
    }, []);

    const handleFilterChange = useCallback((key: keyof PatientFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    }, []);

    const handleSort = useCallback((field: string) => {
        setSort(prev => {
            const newSort: Record<string, any> = {};
            if (prev[field]) {
                newSort[field] = prev[field] === 1 ? -1 : 1;
            } else {
                newSort[field] = 1;
            }
            return newSort;
        });
    }, []);

    const handleDeletePatient = useCallback(async (patientId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
            try {
                await deleteMutation.mutateAsync(patientId);
                console.log('Paciente excluído com sucesso');
            } catch (error) {
                console.error('Erro ao excluir paciente');
            }
        }
    }, [deleteMutation]);

    const addPatient = useCallback((patient: Patient) => {
        refetch();
    }, [refetch]);

    const updatePatient = useCallback((patient: Patient) => {
        refetch();
    }, [refetch]);

    return {
        patients,
        loading: isLoading,
        error: error?.message || null,
        filters,
        sort,
        total,
        totalPages,
        hasNext,
        hasPrev,
        handleSearchChange,
        handleFilterChange,
        handlePageChange,
        handleSort,
        handleDeletePatient,
        addPatient,
        updatePatient,
        fetchPatients: refetch
    };
};
