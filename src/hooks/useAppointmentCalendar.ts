import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { Appointment, Provider } from '@topsmile/types';

interface CalendarFilters {
    providerId?: string;
    status?: string;
    date?: string;
    view: 'day' | 'week' | 'month';
}

export const useAppointmentCalendar = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<CalendarFilters>({
        view: 'week',
        date: new Date().toISOString().split('T')[0]
    });
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const appointmentParams: Record<string, any> = {};
            if (filters.providerId) appointmentParams.providerId = filters.providerId;
            if (filters.status) appointmentParams.status = filters.status;

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

            appointmentParams.start = startDate.toISOString();
            appointmentParams.end = endDate.toISOString();

            const [appointmentsResult, providersResult] = await Promise.all([
                apiService.appointments.getAll(appointmentParams),
                apiService.providers.getAll({ isActive: true })
            ]);

            if (appointmentsResult.success && appointmentsResult.data) {
                setAppointments(appointmentsResult.data);
            } else {
                setError(appointmentsResult.message || 'Erro ao carregar agendamentos');
                setAppointments([]);
            }

            if (providersResult.success && providersResult.data) {
                const providersData = providersResult.data;
                setProviders(Array.isArray(providersData) ? providersData : (providersData as any)?.providers || []);
            } else {
                setProviders([]);
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao carregar agendamentos');
        } finally {
            setLoading(false);
        }
    }, [filters, currentDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (key: keyof CalendarFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const navigateDate = (direction: 'prev' | 'next') => {
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
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setFilters(prev => ({ ...prev, date: today.toISOString().split('T')[0] }));
    };

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

    const addAppointment = (appointment: Appointment) => {
        setAppointments(prev => [appointment, ...prev]);
    };

    const updateAppointment = (appointment: Appointment) => {
        setAppointments(prev => prev.map(a => (a._id === appointment._id ? appointment : a)));
    };

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
        fetchData
    };
};
