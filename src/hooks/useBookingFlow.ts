import { useState, useCallback, useEffect } from 'react';
import { useProviders } from './queries/useProviders';
import { useAppointmentTypes } from './queries/useAppointmentTypes';
import { useCreateAppointment } from './queries/useAppointments';
import { apiService } from '../services/apiService';
import type { Provider, AppointmentType } from '@topsmile/types';

interface TimeSlot {
    time: string;
    available: boolean;
}

export const useBookingFlow = (patientId: string) => {
    const [selectedProvider, setSelectedProvider] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: providersData, isLoading: providersLoading } = useProviders('');
    const { data: appointmentTypesData, isLoading: typesLoading } = useAppointmentTypes('');
    const createMutation = useCreateAppointment();

    const providers = Array.isArray(providersData) ? providersData : (providersData as any)?.providers || [];
    const appointmentTypes = appointmentTypesData || [];

    useEffect(() => {
        if (selectedProvider && selectedDate && selectedType) {
            fetchSlots();
        }
    }, [selectedProvider, selectedDate, selectedType]);

    const fetchSlots = async () => {
        setIsLoadingSlots(true);
        try {
            const response = await apiService.availability.getSlots({
                providerId: selectedProvider,
                appointmentTypeId: selectedType,
                date: selectedDate
            });
            if (response.success && response.data) {
                setAvailableSlots(response.data.map((slot: any) => ({
                    time: new Date(slot.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    available: slot.available
                })));
            }
        } catch (err) {
            console.error('Error fetching slots:', err);
        } finally {
            setIsLoadingSlots(false);
        }
    };

    const handleBooking = useCallback(async () => {
        if (!selectedProvider || !selectedType || !selectedDate || !selectedTime) {
            setError('Por favor, preencha todos os campos obrigatórios');
            return false;
        }

        try {
            setError(null);
            const selectedTypeData = appointmentTypes.find((t: AppointmentType) => t._id === selectedType);
            if (!selectedTypeData?.duration) {
                throw new Error('Tipo de consulta não encontrado');
            }

            const [hours, minutes] = selectedTime.split(':').map(Number);
            const startDateTime = new Date(selectedDate);
            startDateTime.setHours(hours, minutes, 0, 0);

            const endDateTime = new Date(startDateTime);
            endDateTime.setMinutes(endDateTime.getMinutes() + selectedTypeData.duration);

            await createMutation.mutateAsync({
                patient: patientId,
                provider: selectedProvider,
                appointmentType: selectedType,
                scheduledStart: startDateTime.toISOString(),
                scheduledEnd: endDateTime.toISOString(),
                status: 'scheduled',
                notes: notes.trim() || undefined
            });

            return true;
        } catch (err: any) {
            setError(err.message || 'Erro ao agendar consulta');
            return false;
        }
    }, [selectedProvider, selectedType, selectedDate, selectedTime, notes, patientId, appointmentTypes, createMutation]);

    return {
        providers,
        appointmentTypes,
        availableSlots,
        selectedProvider,
        selectedType,
        selectedDate,
        selectedTime,
        notes,
        isLoading: providersLoading || typesLoading || createMutation.isPending,
        isLoadingSlots,
        error,
        setSelectedProvider,
        setSelectedType,
        setSelectedDate,
        setSelectedTime,
        setNotes,
        handleBooking
    };
};
