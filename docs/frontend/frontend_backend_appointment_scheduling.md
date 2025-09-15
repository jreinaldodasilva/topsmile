import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/apiService';
import { Appointment, Provider, Patient, AppointmentType } from '../../../types/api';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';
import { useAuth } from '../../../contexts/AuthContext';

// Complete Appointment Scheduling System with Full Backend Integration
const AppointmentScheduling: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  
  // Modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load appointments when date or provider changes
  useEffect(() => {
    if (selectedDate) {
      loadAppointments();
    }
  }, [selectedDate, selectedProvider]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [providersRes, patientsRes, appointmentTypesRes] = await Promise.all([
        apiService.providers.getAll(),
        apiService.patients.getAll({ limit: 100 }),
        // Assuming we have appointment types endpoint
        fetch('/api/appointment-types').then(r => r.json()).catch(() => ({ success: false, data: [] }))
      ]);

      if (providersRes.success) {
        setProviders(providersRes.data || []);
        if (providersRes.data?.length > 0) {
          setSelectedProvider(providersRes.data[0]._id || providersRes.data[0].id);
        }
      }

      if (patientsRes.success) {
        const patientsList = Array.isArray(patientsRes.data) ? 
          patientsRes.data : 
          patientsRes.data?.patients || [];
        setPatients(patientsList);
      }

      if (appointmentTypesRes.success) {
        setAppointmentTypes(appointmentTypesRes.data || []);
      }

    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados iniciais');
    } finally {
      setLoading(false);
    }
  };

  // Load appointments using backend date range query
  const loadAppointments = async () => {
    if (!selectedDate) return;

    try {
      setLoading(true);
      
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);

      const response = await apiService.appointments.getAll({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        providerId: selectedProvider || undefined
      });

      if (response.success) {
        setAppointments(response.data || []);
      } else {
        setError(response.message || 'Erro ao carregar agendamentos');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  // Load provider availability for booking
  const loadAvailability = async (providerId: string, date: Date, appointmentTypeId: string) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await apiService.appointments.getProviderAvailability(
        providerId, 
        dateStr, 
        appointmentTypeId
      );

      if (response.success) {
        setAvailableSlots(response.data || []);
      }
    } catch (err: any) {
      console.error('Error loading availability:', err);
      setAvailableSlots([]);
    }
  };

  // Book appointment using backend endpoint
  const bookAppointment = async (appointmentData: {
    patientId: string;
    providerId: string;
    appointmentTypeId: string;
    scheduledStart: string;
    notes?: string;
    priority?: string;
  }) => {
    try {
      setLoading(true);
      const response = await apiService.appointments.book(appointmentData);
      
      if (response.success) {
        setShowBookingModal(false);
        loadAppointments();
        alert('Agendamento criado com sucesso!');
      } else {
        alert(response.message || 'Erro ao criar agendamento');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (id: string, status: string, reason?: string) => {
    try {
      setLoading(true);
      const response = await apiService.appointments.updateStatus(id, status, reason);
      
      if (response.success) {
        loadAppointments();
        alert('Status atualizado com sucesso!');
      } else {
        alert(response.message || 'Erro ao atualizar status');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
  };

  // Reschedule appointment
  const rescheduleAppointment = async (id: string, newStart: string, reason: string) => {
    try {
      setLoading(true);
      const response = await apiService.appointments.reschedule(id, newStart, reason, 'clinic');
      
      if (response.success) {
        setShowEditModal(false);
        setSelectedAppointment(null);
        loadAppointments();
        alert('Agendamento reagendado com sucesso!');
      } else {
        alert(response.message || 'Erro ao reagendar');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao reagendar');
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (id: string, reason: string) => {
    if (!window.confirm('Deseja cancelar este agendamento?')) return;

    try {
      setLoading(true);
      const response = await apiService.appointments.updateStatus(id, 'cancelled', reason);
      
      if (response.success) {
        loadAppointments();
        alert('Agendamento cancelado com sucesso!');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao cancelar agendamento');
    } finally {
      setLoading(false);
    }
  };

  // Get patient name helper
  const getPatientName = (appointment: Appointment) => {
    if (typeof appointment.patient === 'object' && appointment.patient) {
      const patient = appointment.patient as Patient;
      return patient.fullName || patient.name || 
        (patient.firstName ? `${patient.firstName} ${patient.lastName || ''}`.trim() : 'Paciente');
    }
    return 'Paciente';
  };

  // Get provider name helper
  const getProviderName = (appointment: Appointment) => {
    if (typeof appointment.provider === 'object' && appointment.provider) {
      const provider = appointment.provider as Provider;
      return provider.name;
    }
    return 'Profissional';
  };

  // Format time helper
  const formatTime = (dateTime: string | Date) => {
    return new Date(dateTime).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="appointment-scheduling">
      {/* Header */}
      <div className="scheduling-header">
        <h2>Agendamentos</h2>
        
        <div className="header-controls">
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="provider-select"
          >
            <option value="">Todos os Profissionais</option>
            {providers.map((provider) => (
              <option key={provider._id || provider.id} value={provider._id || provider.id}>
                {provider.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="date-picker"
          />

          <Button onClick={() => setShowBookingModal(true)}>
            + Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <Button variant="outline" size="sm" onClick={loadAppointments}>
            Tentar Novamente
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Carregando agendamentos...</div>
        </div>
      )}

      {/* Appointments Display */}
      <div className="appointments-container">
        {appointments.length > 0 ? (
          <div className="appointments-list">
            {appointments
              .sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime())
              .map((appointment) => {
                const appointmentId = appointment._id || appointment.id;
                const startTime = formatTime(appointment.scheduledStart);
                const endTime = formatTime(appointment.scheduledEnd);
                
                return (
                  <div key={appointmentId} className={`appointment-card status-${appointment.status}`}>
                    <div className="appointment-time">
                      <strong>{startTime} - {endTime}</strong>
                    </div>
                    
                    <div className="appointment-details">
                      <div className="patient-name">{getPatientName(appointment)}</div>
                      <div className="provider-name">{getProviderName(appointment)}</div>
                      {appointment.notes && (
                        <div className="appointment-notes">{appointment.notes}</div>
                      )}
                    </div>
                    
                    <div className="appointment-status">
                      <span className={`status-badge status-${appointment.status}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                      
                      {appointment.priority && appointment.priority !== 'routine' && (
                        <span className={`priority-badge priority-${appointment.priority}`}>
                          {appointment.priority === 'urgent' ? 'Urgente' : 'Emergência'}
                        </span>
                      )}
                    </div>
                    
                    <div className="appointment-actions">
                      {appointment.status === 'scheduled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointmentId, 'confirmed')}
                        >
                          Confirmar
                        </Button>
                      )}
                      
                      {appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointmentId, 'checked_in')}
                        >
                          Check-in
                        </Button>
                      )}
                      
                      {appointment.status === 'checked_in' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointmentId, 'in_progress')}
                        >
                          Iniciar
                        </Button>
                      )}
                      
                      {appointment.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointmentId, 'completed')}
                        >
                          Concluir
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowEditModal(true);
                        }}
                      >
                        Editar
                      </Button>
                      
                      {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => cancelAppointment(appointmentId, 'Cancelado pelo sistema')}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>Nenhum agendamento encontrado</h3>
            <p>Não há agendamentos para a data selecionada.</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Novo Agendamento"
        size="lg"
      >
        <AppointmentBookingForm
          patients={patients}
          providers={providers}
          appointmentTypes={appointmentTypes}
          selectedDate={selectedDate}
          onLoadAvailability={loadAvailability}
          availableSlots={availableSlots}
          onSubmit={bookAppointment}
          onCancel={() => setShowBookingModal(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAppointment(null);
        }}
        title="Editar Agendamento"
        size="lg"
      >
        {selectedAppointment && (
          <AppointmentEditForm
            appointment={selectedAppointment}
            providers={providers}
            onReschedule={rescheduleAppointment}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedAppointment(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

// Appointment Booking Component
const AppointmentBookingForm: React.FC<{
  patients: Patient[];
  providers: Provider[];
  appointmentTypes: AppointmentType[];
  selectedDate: Date;
  availableSlots: any[];
  onLoadAvailability: (providerId: string, date: Date, appointmentTypeId: string) => void;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ 
  patients, 
  providers, 
  appointmentTypes, 
  selectedDate, 
  availableSlots, 
  onLoadAvailability, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    patientId: '',
    providerId: '',
    appointmentTypeId: '',
    scheduledStart: '',
    notes: '',
    priority: 'routine'
  });

  // Load availability when provider or appointment type changes
  useEffect(() => {
    if (formData.providerId && formData.appointmentTypeId) {
      onLoadAvailability(formData.providerId, selectedDate, formData.appointmentTypeId);
    }
  }, [formData.providerId, formData.appointmentTypeId, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.providerId || !formData.appointmentTypeId || !formData.scheduledStart) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="appointment-booking-form">
      <div className="form-field">
        <label>Paciente *</label>
        <select
          value={formData.patientId}
          onChange={(e) => setFormData({...formData, patientId: e.target.value})}
          required
        >
          <option value="">Selecione um paciente</option>
          {patients.map((patient) => {
            const patientId = patient._id || patient.id;
            const patientName = patient.fullName || patient.name || 
              (patient.firstName ? `${patient.firstName} ${patient.lastName || ''}`.trim() : 'Sem nome');
            return (
              <option key={patientId} value={patientId}>
                {patientName} {patient.phone && `- ${patient.phone}`}
              </option>
            );
          })}
        </select>
      </div>

      <div className="form-field">
        <label>Profissional *</label>
        <select
          value={formData.providerId}
          onChange={(e) => setFormData({...formData, providerId: e.target.value})}
          required
        >
          <option value="">Selecione um profissional</option>
          {providers.map((provider) => (
            <option key={provider._id || provider.id} value={provider._id || provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Tipo de Consulta *</label>
        <select
          value={formData.appointmentTypeId}
          onChange={(e) => setFormData({...formData, appointmentTypeId: e.target.value})}
          required
        >
          <option value="">Selecione o tipo</option>
          {appointmentTypes.map((type) => (
            <option key={type._id || type.id} value={type._id || type.id}>
              {type.name} ({type.duration} min)
            </option>
          ))}
        </select>
      </div>

      {availableSlots.length > 0 && (
        <div className="form-field">
          <label>Horários Disponíveis *</label>
          <div className="time-slots">
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                type="button"
                className={`time-slot ${formData.scheduledStart === slot.start ? 'selected' : ''}`}
                onClick={() => setFormData({...formData, scheduledStart: slot.start})}
              >
                {new Date(slot.start).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="form-field">
        <label>Prioridade</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({...formData, priority: e.target.value})}
        >
          <option value="routine">Rotina</option>
          <option value="urgent">Urgente</option>
          <option value="emergency">Emergência</option>
        </select>
      </div>

      <div className="form-field">
        <label>Observações</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          rows={3}
          placeholder="Informações adicionais sobre a consulta..."
        />
      </div>

      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Agendar
        </Button>
      </div>
    </div>
  );
};

// Appointment Edit Component
const AppointmentEditForm: React.FC<{
  appointment: Appointment;
  providers: Provider[];
  onReschedule: (id: string, newStart: string, reason: string) => void;
  onCancel: () => void;
}> = ({ appointment, providers, onReschedule, onCancel }) => {
  const [newDateTime, setNewDateTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const handleReschedule = () => {
    if (!newDateTime || !rescheduleReason) {
      alert('Preencha a nova data/hora e o motivo');
      return;
    }

    const appointmentId = appointment._id || appointment.id!;
    onReschedule(appointmentId, newDateTime, rescheduleReason);
  };

  return (
    <div className="appointment-edit-form">
      <div className="appointment-info">
        <h3>Agendamento Atual</h3>
        <p><strong>Horário:</strong> {new Date(appointment.scheduledStart).toLocaleString('pt-BR')}</p>
        <p><strong>Status:</strong> {getStatusLabel(appointment.status)}</p>
      </div>

      <div className="form-field">
        <label>Nova Data/Hora</label>
        <input
          type="datetime-local"
          value={newDateTime}
          onChange={(e) => setNewDateTime(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Motivo do Reagendamento *</label>
        <textarea
          value={rescheduleReason}
          onChange={(e) => setRescheduleReason(e.target.value)}
          rows={3}
          placeholder="Explique o motivo do reagendamento..."
          required
        />
      </div>

      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleReschedule}>
          Reagendar
        </Button>
      </div>
    </div>
  );
};

// Helper function to get status labels
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'scheduled': 'Agendado',
    'confirmed': 'Confirmado',
    'checked_in': 'Check-in',
    'in_progress': 'Em Andamento',
    'completed': 'Concluído',
    'cancelled': 'Cancelado',
    'no_show': 'Não Compareceu'
  };
  return labels[status] || status;
};

export default AppointmentScheduling;