// src/features/appointments/components/CalendarExample.tsx
import React, { useEffect, useState } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { useProviders } from '../../providers/hooks/useProviders';

interface CalendarExampleProps {
    clinicId: string;
    date: Date;
    onAppointmentClick: (appointment: any) => void;
}

export const CalendarExample: React.FC<CalendarExampleProps> = ({
    clinicId,
    date,
    onAppointmentClick
}) => {
    const { appointments, loading, error, getAppointments } = useAppointments();
    const { providers, getProviders } = useProviders();
    const [selectedProvider, setSelectedProvider] = useState<string>('all');

    useEffect(() => {
        getProviders();
    }, [getProviders]);

    useEffect(() => {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        getAppointments({
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            ...(selectedProvider !== 'all' && { providerId: selectedProvider })
        });
    }, [date, selectedProvider, getAppointments]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            scheduled: '#2196f3',
            confirmed: '#4caf50',
            checked_in: '#ff9800',
            in_progress: '#9c27b0',
            completed: '#607d8b',
            cancelled: '#f44336',
            no_show: '#e91e63'
        };
        return colors[status] || '#999';
    };

    const getPriorityBadge = (priority?: string) => {
        if (!priority || priority === 'routine') return null;
        return (
            <span className={`priority-badge ${priority}`}>
                {priority === 'urgent' ? '⚡' : '🚨'}
            </span>
        );
    };

    const hours = Array.from({ length: 13 }, (_, i) => i + 7);

    const getAppointmentPosition = (apt: any) => {
        const start = new Date(apt.scheduledStart);
        const end = new Date(apt.scheduledEnd);
        const startHour = start.getHours() + start.getMinutes() / 60;
        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        return {
            top: `${(startHour - 7) * 60}px`,
            height: `${duration * 60}px`
        };
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div className="color-coded-calendar">
            <div className="calendar-header">
                <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="provider-filter"
                >
                    <option value="all">Todos os Profissionais</option>
                    {providers.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div className="calendar-grid">
                <div className="time-column">
                    {hours.map(hour => (
                        <div key={hour} className="time-slot">
                            {hour}:00
                        </div>
                    ))}
                </div>

                <div className="appointments-column">
                    {appointments.map(apt => (
                        <div
                            key={apt.id}
                            className="appointment-block"
                            style={{
                                ...getAppointmentPosition(apt),
                                backgroundColor: apt.colorCode || getStatusColor(apt.status),
                                borderLeft: `4px solid ${getStatusColor(apt.status)}`
                            }}
                            onClick={() => onAppointmentClick(apt)}
                        >
                            {getPriorityBadge(apt.priority)}
                            <div className="apt-patient">
                                {apt.patient.firstName} {apt.patient.lastName}
                            </div>
                            <div className="apt-type">{apt.appointmentType.name}</div>
                            {apt.operatory && <div className="apt-operatory">📍 {apt.operatory}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
