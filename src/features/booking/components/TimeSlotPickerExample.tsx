// src/features/booking/components/TimeSlotPickerExample.tsx
import React, { useEffect } from 'react';
import { useBooking } from '../hooks/useBooking';

interface TimeSlot {
    start: Date;
    end: Date;
    providerId: string;
    providerName: string;
    providerPhoto?: string;
}

interface TimeSlotPickerExampleProps {
    clinicId: string;
    appointmentTypeId: string;
    date: Date;
    providerId?: string | null;
    onSelect: (slot: TimeSlot) => void;
}

export const TimeSlotPickerExample: React.FC<TimeSlotPickerExampleProps> = ({
    clinicId,
    appointmentTypeId,
    date,
    providerId,
    onSelect
}) => {
    const { availableSlots, loading, error, getAvailableSlots } = useBooking();

    useEffect(() => {
        if (appointmentTypeId && date) {
            getAvailableSlots({
                clinicId,
                appointmentTypeId,
                date: date.toISOString(),
                ...(providerId && { providerId })
            });
        }
    }, [appointmentTypeId, date, providerId, clinicId, getAvailableSlots]);

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const groupByProvider = () => {
        const grouped: Record<string, any[]> = {};
        availableSlots.forEach(slot => {
            if (!grouped[slot.providerId]) {
                grouped[slot.providerId] = [];
            }
            grouped[slot.providerId].push(slot);
        });
        return grouped;
    };

    if (loading) return <div className="loading">Carregando horários...</div>;
    if (error) return <div className="error">Erro: {error}</div>;
    if (availableSlots.length === 0) {
        return <div className="no-slots">Nenhum horário disponível para esta data</div>;
    }

    const groupedSlots = groupByProvider();

    return (
        <div className="time-slot-picker">
            <h3>Escolha um Horário</h3>

            {Object.entries(groupedSlots).map(([provId, provSlots]) => (
                <div key={provId} className="provider-slots">
                    <h4>{provSlots[0].providerName}</h4>
                    <div className="slots-grid">
                        {provSlots.map((slot, idx) => (
                            <button
                                key={idx}
                                className="slot-btn"
                                onClick={() =>
                                    onSelect({
                                        ...slot,
                                        start: new Date(slot.start),
                                        end: new Date(slot.end)
                                    })
                                }
                            >
                                {formatTime(slot.start)}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
