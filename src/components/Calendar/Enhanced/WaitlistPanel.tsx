// src/components/Calendar/Enhanced/WaitlistPanel.tsx
import React, { useState, useEffect } from 'react';
import './WaitlistPanel.css';

interface WaitlistEntry {
    id: string;
    patient: { firstName: string; lastName: string; phone: string };
    appointmentType: { name: string };
    priority: string;
    preferredDates: string[];
    contactAttempts: number;
    createdAt: string;
}

interface WaitlistPanelProps {
    onSchedule: (entry: WaitlistEntry) => void;
}

export const WaitlistPanel: React.FC<WaitlistPanelProps> = ({ onSchedule }) => {
    const [entries, setEntries] = useState<WaitlistEntry[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchWaitlist();
    }, []);

    const fetchWaitlist = async () => {
        const res = await fetch('/api/waitlist');
        const data = await res.json();
        if (data.success) setEntries(data.data);
    };

    const handleContact = async (id: string) => {
        await fetch(`/api/waitlist/${id}/contact`, { method: 'PATCH' });
        fetchWaitlist();
    };

    const handleCancel = async (id: string) => {
        await fetch(`/api/waitlist/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'cancelled' })
        });
        fetchWaitlist();
    };

    const getPriorityColor = (priority: string) => {
        const colors: Record<string, string> = {
            routine: '#2196f3',
            urgent: '#ff9800',
            emergency: '#f44336'
        };
        return colors[priority] || '#999';
    };

    return (
        <div className="waitlist-panel">
            <div className="panel-header">
                <h3>Lista de Espera</h3>
                <button onClick={() => setShowAddForm(true)} className="add-btn">
                    + Adicionar
                </button>
            </div>

            <div className="waitlist-entries">
                {entries.length === 0 ? (
                    <div className="no-entries">Nenhuma entrada na lista de espera</div>
                ) : (
                    entries.map(entry => (
                        <div key={entry.id} className="waitlist-entry">
                            <div className="entry-header">
                                <span
                                    className="priority-indicator"
                                    style={{ backgroundColor: getPriorityColor(entry.priority) }}
                                />
                                <strong>
                                    {entry.patient.firstName} {entry.patient.lastName}
                                </strong>
                            </div>
                            <div className="entry-details">
                                <div>{entry.appointmentType.name}</div>
                                <div className="entry-phone">{entry.patient.phone}</div>
                                <div className="entry-attempts">Tentativas de contato: {entry.contactAttempts}</div>
                            </div>
                            <div className="entry-actions">
                                <button onClick={() => handleContact(entry.id)} className="contact-btn">
                                    Contatar
                                </button>
                                <button onClick={() => onSchedule(entry)} className="schedule-btn">
                                    Agendar
                                </button>
                                <button onClick={() => handleCancel(entry.id)} className="cancel-btn">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
