// src/components/Booking/TimeSlotPicker.tsx
import React, { useState, useEffect } from 'react';
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
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointmentTypeId && date) {
      fetchSlots();
    }
  }, [appointmentTypeId, date, providerId]);

  const fetchSlots = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      clinicId,
      appointmentTypeId,
      date: date.toISOString(),
      ...(providerId && { providerId })
    });

    const res = await fetch(`/api/booking/available-slots?${params}`);
    const data = await res.json();
    if (data.success) {
      setSlots(data.data.map((s: any) => ({
        ...s,
        start: new Date(s.start),
        end: new Date(s.end)
      })));
    }
    setLoading(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const groupByProvider = () => {
    const grouped: Record<string, TimeSlot[]> = {};
    slots.forEach(slot => {
      if (!grouped[slot.providerId]) {
        grouped[slot.providerId] = [];
      }
      grouped[slot.providerId].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupByProvider();

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
              <button
                key={idx}
                className="slot-btn"
                onClick={() => onSelect(slot)}
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
