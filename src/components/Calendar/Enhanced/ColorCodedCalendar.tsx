// src/components/Calendar/Enhanced/ColorCodedCalendar.tsx
import React, { useState, useEffect } from 'react';
import './ColorCodedCalendar.css';

interface Appointment {
    id: string;
    scheduledStart: string;
    scheduledEnd: string;
    patient: { firstName: string; lastName: string };
    provider: { name: string };
    appointmentType: { name: string };
    status: string;
    colorCode?: string;
    operatory?: string;
    priority?: string;
}

interface ColorCodedCalendarProps {
    clinicId: string;
    date: Date;
    onAppointmentClick: (appointment: Appointment) => void;
}

export const ColorCodedCalendar: React.FC<ColorCodedCalendarProps> = ({ clinicId, date, onAppointmentClick }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [providers, setProviders] = useState<any[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<string>('all');

    useEffect(() => {
        fetchAppointments();
        fetchProviders();
    }, [date, selectedProvider]);

    const fetchAppointments = async () => {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const params = new URLSearchParams({
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            ...(selectedProvider !== 'all' && { providerId: selectedProvider })
        });

        const res = await fetch(`/api/appointments?${params}`);
        const data = await res.json();
        if (data.success) setAppointments(data.data);
    };

    const fetchProviders = async () => {
        const res = await fetch('/api/providers');
        const data = await res.json();
        if (data.success) setProviders(data.data);
    };

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
        return <span className={`priority-badge ${priority}`}>{priority === 'urgent' ? '⚡' : '🚨'}</span>;
    };

    const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

    const getAppointmentPosition = (apt: Appointment) => {
        const start = new Date(apt.scheduledStart);
        const end = new Date(apt.scheduledEnd);
        const startHour = start.getHours() + start.getMinutes() / 60;
        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        return {
            top: `${(startHour - 7) * 60}px`,
            height: `${duration * 60}px`
        };
    };

    return (
        <div className="color-coded-calendar">
            <div className="calendar-header">
                <select
                    value={selectedProvider}
                    onChange={e => setSelectedProvider(e.target.value)}
                    className="provider-filter"
                >
                    <option value="all">Todos os Profissionais</option>
                    {providers.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
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
