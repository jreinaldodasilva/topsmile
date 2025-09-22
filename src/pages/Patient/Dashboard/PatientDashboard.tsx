import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientAuth } from '../../../contexts/PatientAuthContext';
import { useAppointments } from '../../../hooks/useApiState';
import PatientNavigation from '../../../components/PatientNavigation';
import type { Appointment } from '../../../../packages/types/src/index';
import './PatientDashboard.css';
import type { Appointment } from '@topsmile/types';




const PatientDashboard: React.FC = function PatientDashboard() {
  const { patientUser, isAuthenticated } = usePatientAuth();
  const navigate = useNavigate();

  const { data: allAppointments, isLoading, error, refetch } = useAppointments(
    { patient: patientUser?.patient._id, sort: 'scheduledStart' },
    { refetchInterval: 30000, enabled: !!patientUser } // Poll every 30 seconds, only enable when patientUser is available
  );

  // For now, keep using the admin appointments API. In a full implementation,
  // we'd create a custom hook for patient appointments that uses the patient-specific endpoints

  const upcomingAppointments = useMemo(() => {
    if (!allAppointments?.data) return [];
    return allAppointments.data
      .filter((a: Appointment) => a.scheduledStart && new Date(a.scheduledStart) > new Date())
      .slice(0, 5);
  }, [allAppointments]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/patient/login');
    }
  }, [isAuthenticated, navigate]);

  const formatDateTime = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'scheduled':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'scheduled':
        return 'Agendado';
      default:
        return status || 'Agendado';
    }
  };

  const totalAppointments = allAppointments?.data?.length || 0;
  const completedAppointments = allAppointments?.data?.filter((a: Appointment) => a.status === 'completed').length || 0;
  const pendingAppointments = totalAppointments - completedAppointments;

  if (!patientUser) {
    return (
      <div className="patient-dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      {/* Navigation */}
      <PatientNavigation activePage="dashboard" />

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1 className="welcome-title">
                Olá, {patientUser.patient.name.split(' ')[0]}!
              </h1>
              <p className="welcome-subtitle">
                Bem-vindo ao seu portal do paciente
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-grid">
          {/* Quick Actions */}
          <section className="dashboard-section quick-actions">
            <h2 className="section-title">Ações Rápidas</h2>
            <div className="actions-grid">
              <button
                className="action-card"
                onClick={() => navigate('/patient/appointments/new')}
              >
                <div className="action-icon">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="action-content">
                  <h3>Agendar Consulta</h3>
                  <p>Marque uma nova consulta</p>
                </div>
              </button>

              <button
                className="action-card"
                onClick={() => navigate('/patient/appointments')}
              >
                <div className="action-icon">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="action-content">
                  <h3>Meus Agendamentos</h3>
                  <p>Veja seus agendamentos</p>
                </div>
              </button>

              <button
                className="action-card"
                onClick={() => navigate('/patient/profile')}
              >
                <div className="action-icon">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="action-content">
                  <h3>Meu Perfil</h3>
                  <p>Gerencie suas informações</p>
                </div>
              </button>
            </div>
          </section>

          {/* Upcoming Appointments */}
          <section className="dashboard-section upcoming-appointments">
            <div className="section-header">
              <h2 className="section-title">Próximos Agendamentos</h2>
              <button
                className="view-all-button"
                onClick={() => navigate('/patient/appointments')}
              >
                Ver todos
              </button>
            </div>

            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Carregando agendamentos...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error.message}</p>
                <button
                  onClick={() => refetch()}
                  className="retry-button"
                >
                  Tentar novamente
                </button>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3>Nenhum agendamento encontrado</h3>
                <p>Você não tem agendamentos próximos.</p>
                <button
                  onClick={() => navigate('/patient/appointments/new')}
                  className="schedule-button"
                >
                  Agendar Consulta
                </button>
              </div>
            ) : (
              <div className="appointments-list">
                {upcomingAppointments.map((appointment: Appointment) => {
                  const { date, time } = appointment.scheduledStart ? formatDateTime(appointment.scheduledStart) : { date: '', time: '' };
                  return (
                    <div key={appointment._id} className="appointment-card">
                      <div className="appointment-info">
                        <div className="appointment-primary">
                          <h3>{typeof appointment.appointmentType === 'object' && appointment.appointmentType?.name ? appointment.appointmentType.name : 'Consulta'}</h3>
                          <p className="appointment-provider">
                            Dr. {typeof appointment.provider === 'object' && appointment.provider?.name ? appointment.provider.name : 'Profissional não informado'}
                          </p>
                        </div>
                        <div className="appointment-secondary">
                          <div className="appointment-datetime">
                            <span className="appointment-date">{date}</span>
                            <span className="appointment-time">{time}</span>
                          </div>
                          <span
                            className="appointment-status"
                            style={{ backgroundColor: getStatusColor(appointment.status || 'scheduled') }}
                          >
                            {getStatusText(appointment.status || 'scheduled')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Health Summary */}
          <section className="dashboard-section health-summary">
            <h2 className="section-title">Resumo de Saúde</h2>
            <div className="health-cards">
              <div className="health-card">
                <div className="health-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="health-content">
                  <h3>Total de Consultas</h3>
                  <p>{totalAppointments}</p>
                </div>
              </div>

              <div className="health-card">
                <div className="health-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="health-content">
                  <h3>Consultas Realizadas</h3>
                  <p>{completedAppointments}</p>
                </div>
              </div>

              <div className="health-card">
                <div className="health-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="health-content">
                  <h3>Consultas Pendentes</h3>
                  <p>{pendingAppointments}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Health Reminders */}
          <section className="dashboard-section health-reminders">
            <h2 className="section-title">Lembretes de Saúde</h2>
            <div className="reminders-list">
              {/* Personalized reminders based on medical history */}
              {patientUser?.patient?.medicalHistory?.allergies && patientUser.patient.medicalHistory.allergies.length > 0 && (
                <div className="reminder-card reminder-allergy">
                  <div className="reminder-icon">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="reminder-content">
                    <h3>Alergias Registradas</h3>
                    <p>Você tem alergias registradas. Mantenha seu cadastro atualizado.</p>
                    <span className="reminder-date">Importante</span>
                  </div>
                </div>
              )}

              {patientUser?.patient?.medicalHistory?.medications && patientUser.patient.medicalHistory.medications.length > 0 && (
                <div className="reminder-card reminder-medication">
                  <div className="reminder-icon">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="reminder-content">
                    <h3>Medicações</h3>
                    <p>Você tem medicações registradas. Consulte seu dentista sobre interações.</p>
                    <span className="reminder-date">Verificar</span>
                  </div>
                </div>
              )}

{upcomingAppointments.length === 0 && (
                <div className="reminder-card reminder-appointment">
                  <div className="reminder-icon">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="reminder-content">
                    <h3>Agende sua próxima consulta</h3>
                    <p>Não encontramos nenhuma consulta futura. Mantenha sua saúde bucal em dia.</p>
                    <button
                      onClick={() => navigate('/patient/appointments/new')}
                      className="schedule-button"
                    >
                      Agendar Consulta
                    </button>
                  </div>
                </div>
              )}

              <div className="reminder-card reminder-cleaning">
                <div className="reminder-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="reminder-content">
                  <h3>Higienização</h3>
                  <p>Limpeza dental profissional recomendada a cada 6 meses</p>
                  <span className="reminder-date">Recomendado</span>
                </div>
              </div>

              {(!patientUser?.patient?.medicalHistory ||
                !patientUser.patient.medicalHistory.allergies ||
                !patientUser.patient.medicalHistory.medications ||
                !patientUser.patient.medicalHistory.conditions) && (
                <div className="reminder-card reminder-profile">
                  <div className="reminder-icon">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="reminder-content">
                    <h3>Complete seu Perfil de Saúde</h3>
                    <p>Manter seu histórico médico atualizado nos ajuda a oferecer um melhor atendimento.</p>
                    <button
                      onClick={() => navigate('/patient/profile')}
                      className="schedule-button"
                    >
                      Completar Perfil
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      </div>
    </div>
  );
};

export default PatientDashboard;