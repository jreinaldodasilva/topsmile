import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
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
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<PatientFilters>({
        search: '',
        isActive: true,
        page: 1,
        limit: 20
    });
    const [sort, setSort] = useState<Record<string, any>>({ createdAt: -1 });
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);

    const fetchPatients = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const queryParams: Record<string, any> = {};
            if (filters.search) queryParams.search = filters.search;
            if (filters.isActive !== undefined) queryParams.isActive = filters.isActive;
            if (filters.page) queryParams.page = filters.page;
            if (filters.limit) queryParams.limit = filters.limit;
            if (sort) queryParams.sort = JSON.stringify(sort);

            const result = await apiService.patients.getAll(queryParams);

            if (result.success && result.data) {
                if (Array.isArray(result.data)) {
                    setPatients(result.data);
                    setTotal(result.data.length);
                    setTotalPages(1);
                    setHasNext(false);
                    setHasPrev(false);
                } else {
                    const paginatedData = result.data as PaginatedPatientsResponse;
                    setPatients(paginatedData.patients);
                    setTotal(paginatedData.total);
                    setTotalPages(paginatedData.totalPages);
                    setHasNext(paginatedData.hasNext);
                    setHasPrev(paginatedData.hasPrev);
                }
            } else {
                setError(result.message || 'Erro ao carregar pacientes');
                setPatients([]);
                setTotal(0);
                setTotalPages(0);
                setHasNext(false);
                setHasPrev(false);
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao carregar pacientes');
            setPatients([]);
            setTotal(0);
            setTotalPages(0);
            setHasNext(false);
            setHasPrev(false);
        } finally {
            setLoading(false);
        }
    }, [filters, sort]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

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
                await apiService.patients.delete(patientId);
                fetchPatients();
            } catch (error) {
                console.error('Failed to delete patient:', error);
            }
        }
    }, [fetchPatients]);

    const addPatient = useCallback((patient: Patient) => {
        setPatients(prev => [patient, ...prev]);
        setTotal(prev => prev + 1);
    }, []);

    const updatePatient = useCallback((patient: Patient) => {
        setPatients(prev => prev.map(p => (p._id === patient._id ? patient : p)));
    }, []);

    return {
        patients,
        loading,
        error,
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
        fetchPatients
    };
};
