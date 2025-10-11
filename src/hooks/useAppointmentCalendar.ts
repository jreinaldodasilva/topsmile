import { useState, useCallback } from 'react';
import { useAppointments, useCancelAppointment } from './queries';
import { useProviders } from './queries';
import { useAuth } from '../contexts/AuthContext';
import type { Appointment, Provider } from '@topsmile/types';

interface CalendarFilters {
    providerId?: string;
    status?: string;
    date?: string;
    view: 'day' | 'week' | 'month';
}

export const useAppointmentCalendar = () => {
    const { user } = useAuth();
    const [filters, setFilters] = useState<CalendarFilters>({
        view: 'week',
        date: new Date().toISOString().split('T')[0]
    });
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDateRange = () => {
        const startDate = new Date(currentDate);
        const endDate = new Date(currentDate);

        switch (filters.view) {
            case 'day':
                endDate.setDate(startDate.getDate() + 1);
                break;
            case 'week':
                startDate.setDate(currentDate.getDate() - currentDate.getDay());
                endDate.setDate(startDate.getDate() + 7);
                break;
            case 'month':
                startDate.setDate(1);
                endDate.setMonth(startDate.getMonth() + 1);
                endDate.setDate(0);
                break;
        }

        return { startDate, endDate };
    };

    const { startDate, endDate } = getDateRange();
    const appointmentFilters = {
        ...filters,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
    };

    const { data: appointmentsData, isLoading: appointmentsLoading, error: appointmentsError, refetch } = useAppointments(
        user?.clinicId || '',
        appointmentFilters
    );
    const { data: providersData, isLoading: providersLoading } = useProviders(user?.clinicId || '', { isActive: true });

    const appointments = appointmentsData || [];
    const providers = providersData || [];
    const loading = appointmentsLoading || providersLoading;
    const error = appointmentsError?.message || null;

    const handleFilterChange = useCallback((key: keyof CalendarFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const navigateDate = useCallback((direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);

        switch (filters.view) {
            case 'day':
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
                break;
            case 'week':
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
                break;
        }

        setCurrentDate(newDate);
        setFilters(prev => ({ ...prev, date: newDate.toISOString().split('T')[0] }));
    }, [currentDate, filters.view]);

    const goToToday = useCallback(() => {
        const today = new Date();
        setCurrentDate(today);
        setFilters(prev => ({ ...prev, date: today.toISOString().split('T')[0] }));
    }, []);

    const getDateRangeLabel = () => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };

        switch (filters.view) {
            case 'day':
                return currentDate.toLocaleDateString('pt-BR', options);
            case 'week':
                const weekStart = new Date(currentDate);
                weekStart.setDate(currentDate.getDate() - currentDate.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                return `${weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${weekEnd.toLocaleDateString('pt-BR', options)}`;
            case 'month':
                return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            default:
                return '';
        }
    };

    const addAppointment = useCallback((appointment: Appointment) => {
        refetch();
    }, [refetch]);

    const updateAppointment = useCallback((appointment: Appointment) => {
        refetch();
    }, [refetch]);

    return {
        appointments,
        providers,
        loading,
        error,
        filters,
        currentDate,
        handleFilterChange,
        navigateDate,
        goToToday,
        getDateRangeLabel,
        addAppointment,
        updateAppointment,
        fetchData: refetch
    };
};
