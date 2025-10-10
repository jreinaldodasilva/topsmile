// src/components/Booking/BookingConfirmation.tsx
import React from 'react';
import './BookingConfirmation.css';

interface BookingConfirmationProps {
    appointment: {
        treatmentType: string;
        providerName: string;
        date: Date;
        time: string;
        duration: number;
        price: number;
    };
    onConfirm: () => void;
    onEdit: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ appointment, onConfirm, onEdit }) => {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="booking-confirmation">
            <div className="confirmation-icon">✓</div>
            <h2>Confirme seu Agendamento</h2>

            <div className="confirmation-details">
                <div className="detail-row">
                    <span className="label">Tipo de Consulta:</span>
                    <span className="value">{appointment.treatmentType}</span>
                </div>
                <div className="detail-row">
                    <span className="label">Profissional:</span>
                    <span className="value">{appointment.providerName}</span>
                </div>
                <div className="detail-row">
                    <span className="label">Data:</span>
                    <span className="value">{formatDate(appointment.date)}</span>
                </div>
                <div className="detail-row">
                    <span className="label">Horário:</span>
                    <span className="value">{appointment.time}</span>
                </div>
                <div className="detail-row">
                    <span className="label">Duração:</span>
                    <span className="value">{appointment.duration} minutos</span>
                </div>
                <div className="detail-row price">
                    <span className="label">Valor:</span>
                    <span className="value">R$ {appointment.price.toFixed(2)}</span>
                </div>
            </div>

            <div className="confirmation-actions">
                <button onClick={onEdit} className="edit-btn">
                    Editar
                </button>
                <button onClick={onConfirm} className="confirm-btn">
                    Confirmar Agendamento
                </button>
            </div>
        </div>
    );
};
