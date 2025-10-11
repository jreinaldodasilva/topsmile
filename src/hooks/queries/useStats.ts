import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';

const QUERY_KEYS = {
    all: ['stats'] as const,
    dashboard: (clinicId: string) => [...QUERY_KEYS.all, 'dashboard', clinicId] as const,
    patients: (clinicId: string) => [...QUERY_KEYS.all, 'patients', clinicId] as const,
    appointments: (clinicId: string) => [...QUERY_KEYS.all, 'appointments', clinicId] as const,
};

export const useDashboardStats = (clinicId: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.dashboard(clinicId),
        queryFn: () => apiService.stats.getDashboard(clinicId),
        staleTime: 2 * 60 * 1000,
        enabled: !!clinicId
    });
};

export const usePatientStats = (clinicId: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.patients(clinicId),
        queryFn: () => apiService.stats.getPatients(clinicId),
        staleTime: 5 * 60 * 1000,
        enabled: !!clinicId
    });
};

export const useAppointmentStats = (clinicId: string, startDate?: Date, endDate?: Date) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.appointments(clinicId), startDate, endDate],
        queryFn: () => apiService.stats.getAppointments(clinicId, startDate, endDate),
        staleTime: 2 * 60 * 1000,
        enabled: !!clinicId
    });
};
