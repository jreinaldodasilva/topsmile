// src/components/Booking/TimeSlotPicker.tsx
import React from 'react';
import { useAvailableSlots } from '../../hooks/queries/useBooking';
import './TimeSlotPicker.css';

interface TimeSlot {
    start: Date;
    end: Date;
    providerId: string;
    providerName: string;
    providerPhoto?: string;
}

interface TimeSlotPickerProps {
    clinicId: string;
    appointmentTypeId: string;
    date: Date;
    providerId?: string | null;
    onSelect: (slot: TimeSlot) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
    clinicId,
    appointmentTypeId,
    date,
    providerId,
    onSelect
}) => {
    const { data: slots = [], isLoading: loading } = useAvailableSlots(
        clinicId,
        appointmentTypeId,
        date.toISOString(),
        providerId || undefined
    );

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const groupedSlots = slots.reduce((acc: Record<string, TimeSlot[]>, slot) => {
        if (!acc[slot.providerId]) {
            acc[slot.providerId] = [];
        }
        acc[slot.providerId].push(slot);
        return acc;
    }, {});

    if (loading) {
        return <div className="loading">Carregando horários...</div>;
    }

    if (slots.length === 0) {
        return <div className="no-slots">Nenhum horário disponível para esta data</div>;
    }

    return (
        <div className="time-slot-picker">
            <h3>Escolha um Horário</h3>

            {Object.entries(groupedSlots).map(([provId, provSlots]) => (
                <div key={provId} className="provider-slots">
                    <h4>{provSlots[0].providerName}</h4>
                    <div className="slots-grid">
                        {provSlots.map((slot, idx) => (
                            <button key={idx} className="slot-btn" onClick={() => onSelect(slot)}>
                                {formatTime(slot.start)}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
