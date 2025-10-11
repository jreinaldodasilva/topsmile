import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientAuth } from '../../../contexts/PatientAuthContext';
import { useBookingFlow } from '../../../hooks/useBookingFlow';
import PatientNavigation from '../../../components/PatientNavigation';
import type { Provider } from '@topsmile/types';
import './PatientAppointmentBooking.css';

const PatientAppointmentBooking: React.FC = function PatientAppointmentBooking() {
    const { patientUser, isAuthenticated } = usePatientAuth();
    const navigate = useNavigate();

    const {
        providers,
        appointmentTypes,
        availableSlots,
        selectedProvider,
        selectedType,
        selectedDate,
        selectedTime,
        notes,
        isLoading,
        isLoadingSlots,
        error,
        setSelectedProvider,
        setSelectedType,
        setSelectedDate,
        setSelectedTime,
        setNotes,
        handleBooking: bookAppointment
    } = useBookingFlow(patientUser?.patient._id || '');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/patient/login');
        }
    }, [isAuthenticated, navigate]);

    const handleBooking = async () => {
        const success = await bookAppointment();
        if (success) {
            navigate('/patient/appointments', {
                state: { message: 'Consulta agendada com sucesso!' }
            });
        }
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking up to 3 months in advance
        return maxDate.toISOString().split('T')[0];
    };

    if (isLoading) {
        return (
            <div className="appointment-booking">
                <div className="booking-loading">
                    <div className="loading-spinner"></div>
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }



    return (
        <div className="appointment-booking">
            <PatientNavigation activePage="appointments" />

            <div className="booking-content">
                {/* Header */}
                <header className="booking-header">
                    <div className="header-content">
                        <h1 className="page-title">Agendar Consulta</h1>
                        <button className="back-btn" onClick={() => navigate('/patient/appointments')}>
                            ← Voltar
                        </button>
                    </div>
                </header>

                {/* Booking Form */}
                <main className="booking-main">
                    <div className="booking-form">
                        {error && (
                            <div className="error-message">
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Step 1: Select Provider */}
                        <div className="form-section">
                            <h2>1. Escolha o Dentista</h2>
                            <div className="form-group">
                                <label htmlFor="provider">Dentista *</label>
                                <select
                                    id="provider"
                                    value={selectedProvider}
                                    onChange={e => setSelectedProvider(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">Selecione um dentista</option>
                                    {providers.map((provider: Provider) => (
                                        <option key={provider._id} value={provider._id}>
                                            Dr. {provider.name} -{' '}
                                            {provider.specialties?.join(', ') || 'Sem especialidades'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Step 2: Select Appointment Type */}
                        <div className="form-section">
                            <h2>2. Tipo de Consulta</h2>
                            <div className="form-group">
                                <label htmlFor="appointmentType">Tipo de Consulta *</label>
                                <select
                                    id="appointmentType"
                                    value={selectedType}
                                    onChange={e => setSelectedType(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">Selecione o tipo de consulta</option>
                                    {appointmentTypes.map(type => (
                                        <option key={type._id} value={type._id}>
                                            {type.name} - {type.duration}min - R$ {type.price}
                                        </option>
                                    ))}
                                </select>
                                {selectedType && (
                                    <p className="field-description">
                                        {appointmentTypes.find(type => type._id === selectedType)?.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Step 3: Select Date */}
                        <div className="form-section">
                            <h2>3. Escolha a Data</h2>
                            <div className="form-group">
                                <label htmlFor="date">Data *</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={selectedDate}
                                    onChange={e => setSelectedDate(e.target.value)}
                                    min={getMinDate()}
                                    max={getMaxDate()}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {/* Step 4: Select Time */}
                        {selectedDate && selectedProvider && (
                            <div className="form-section">
                                <h2>4. Escolha o Horário</h2>
                                {isLoadingSlots ? (
                                    <div className="loading-state">
                                        <div className="loading-spinner"></div>
                                        <p>Carregando horários...</p>
                                    </div>
                                ) : (
                                    <div className="time-slots">
                                        {availableSlots.map(slot => (
                                            <button
                                                key={slot.time}
                                                className={`time-slot ${selectedTime === slot.time ? 'selected' : ''} ${!slot.available ? 'unavailable' : ''}`}
                                                onClick={() => slot.available && setSelectedTime(slot.time)}
                                                disabled={!slot.available}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 5: Additional Notes */}
                        <div className="form-section">
                            <h2>5. Observações (Opcional)</h2>
                            <div className="form-group">
                                <label htmlFor="notes">Observações</label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Descreva qualquer informação relevante para a consulta..."
                                    className="form-textarea"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Booking Summary */}
                        {selectedProvider && selectedType && selectedDate && selectedTime && (
                            <div className="booking-summary">
                                <h3>Resumo do Agendamento</h3>
                                <div className="summary-details">
                                    <p>
                                        <strong>Dentista:</strong> Dr.{' '}
                                        {providers.find((p: Provider) => p._id === selectedProvider)?.name}
                                    </p>
                                    <p>
                                        <strong>Tipo:</strong>{' '}
                                        {appointmentTypes.find(t => t._id === selectedType)?.name}
                                    </p>
                                    <p>
                                        <strong>Data:</strong> {new Date(selectedDate).toLocaleDateString('pt-BR')}
                                    </p>
                                    <p>
                                        <strong>Horário:</strong> {selectedTime}
                                    </p>
                                    <p>
                                        <strong>Duração:</strong>{' '}
                                        {appointmentTypes.find(t => t._id === selectedType)?.duration} minutos
                                    </p>
                                    <p>
                                        <strong>Valor:</strong> R${' '}
                                        {appointmentTypes.find(t => t._id === selectedType)?.price}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/patient/appointments')}
                                className="cancel-btn"
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleBooking}
                                className="book-btn"
                                disabled={
                                    isLoading ||
                                    !selectedProvider ||
                                    !selectedType ||
                                    !selectedDate ||
                                    !selectedTime
                                }
                            >
                                {isLoading ? (
                                    <>
                                        <div className="loading-spinner small"></div>
                                        Agendando...
                                    </>
                                ) : (
                                    'Confirmar Agendamento'
                                )}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PatientAppointmentBooking;
