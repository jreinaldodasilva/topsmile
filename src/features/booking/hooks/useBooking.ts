// src/features/booking/hooks/useBooking.ts
import { useState, useCallback } from 'react';
import { bookingService } from '../services/bookingService';

export const useBooking = () => {
    const [appointmentTypes, setAppointmentTypes] = useState<any[]>([]);
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAppointmentTypes = useCallback(async (clinicId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await bookingService.getAppointmentTypes(clinicId);
            setAppointmentTypes(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar tipos de consulta');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAvailableSlots = useCallback(
        async (params: { clinicId: string; appointmentTypeId: string; date: string; providerId?: string }) => {
            setLoading(true);
            setError(null);
            try {
                const response = await bookingService.getAvailableSlots(params);
                setAvailableSlots(response.data);
            } catch (err: any) {
                setError(err.message || 'Erro ao buscar horários disponíveis');
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const createBooking = useCallback(async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await bookingService.createBooking(data);
            return response.data;
        } catch (err: any) {
            setError(err.message || 'Erro ao criar agendamento');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        appointmentTypes,
        availableSlots,
        loading,
        error,
        getAppointmentTypes,
        getAvailableSlots,
        createBooking
    };
};
