// src/features/appointments/hooks/useAppointments.ts
import { useState, useCallback } from 'react';
import { appointmentService } from '../services/appointmentService';

interface UseAppointmentsReturn {
    appointment: any | null;
    appointments: any[];
    loading: boolean;
    error: string | null;
    getAppointments: (params: any) => Promise<void>;
    getById: (id: string) => Promise<void>;
    create: (data: any) => Promise<void>;
    update: (id: string, data: any) => Promise<void>;
    updateStatus: (id: string, status: string, cancellationReason?: string) => Promise<void>;
    reschedule: (id: string, newStart: string, reason: string, rescheduleBy: 'patient' | 'clinic') => Promise<void>;
    deleteAppointment: (id: string) => Promise<void>;
}

export const useAppointments = (): UseAppointmentsReturn => {
    const [appointment, setAppointment] = useState<any | null>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAppointments = useCallback(async (params: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await appointmentService.getAppointments(params);
            setAppointments(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar agendamentos');
        } finally {
            setLoading(false);
        }
    }, []);

    const getById = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await appointmentService.getById(id);
            setAppointment(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar agendamento');
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await appointmentService.create(data);
            setAppointment(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao criar agendamento');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const update = useCallback(async (id: string, data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await appointmentService.update(id, data);
            setAppointment(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar agendamento');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStatus = useCallback(async (id: string, status: string, cancellationReason?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await appointmentService.updateStatus(id, status, cancellationReason);
            setAppointment(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar status');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reschedule = useCallback(async (id: string, newStart: string, reason: string, rescheduleBy: 'patient' | 'clinic') => {
        setLoading(true);
        setError(null);
        try {
            const response = await appointmentService.reschedule(id, newStart, reason, rescheduleBy);
            setAppointment(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao reagendar');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteAppointment = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await appointmentService.delete(id);
            setAppointment(null);
        } catch (err: any) {
            setError(err.message || 'Erro ao excluir agendamento');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        appointment,
        appointments,
        loading,
        error,
        getAppointments,
        getById,
        create,
        update,
        updateStatus,
        reschedule,
        deleteAppointment
    };
};
