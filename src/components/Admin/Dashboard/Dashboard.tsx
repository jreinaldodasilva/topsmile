// src/components/Admin/Dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import Button from '../../UI/Button/Button';
import { apiService } from '../../../services/apiService';
import type { Patient, DashboardStats, Appointment as ApiAppointment } from '@topsmile/types';
import './Dashboard.css';

interface DashboardAppointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface RecentPatient {
  id: string;
  name: string;
  lastVisit: Date;
  nextAppointment?: Date;
  status: 'active' | 'inactive';
  avatar?: string;
}

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  completed: boolean;
}

const EnhancedDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    contacts: {
      total: 0,
      byStatus: [],
      bySource: [],
      recentCount: 0,
      monthlyTrend: []
    },
    summary: {
      totalContacts: 0,
      newThisWeek: 0,
      conversionRate: 0,
      revenue: '0'
    },
    user: {
      name: '',
      role: '',
      clinicId: '',
      lastActivity: ''
    }
  });
  
  const [upcomingAppointments, setUpcomingAppointments] = useState<DashboardAppointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<RecentPatient[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, appointmentsRes, patientsRes] = await Promise.all([
          apiService.dashboard.getStats(),
          apiService.appointments.getAll({ limit: 5, sort: 'scheduledStart' }),
          apiService.patients.getAll({ limit: 5, sort: '-createdAt' })
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        } else {
          console.error(statsRes.message);
        }

        if (appointmentsRes.success && appointmentsRes.data) {
          const mappedAppointments: DashboardAppointment[] = (appointmentsRes.data as ApiAppointment[]).slice(0, 5).map(apiApt => ({
            id: apiApt._id || apiApt.id || '',
            patientName: typeof apiApt.patient === 'string' ? apiApt.patient : apiApt.patient?.fullName || `${apiApt.patient?.firstName} ${apiApt.patient?.lastName || ''}`.trim() || 'Unknown',
            time: apiApt.scheduledStart ? new Date(apiApt.scheduledStart).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
            type: typeof apiApt.appointmentType === 'string' ? apiApt.appointmentType : apiApt.appointmentType?.name || 'Consulta',
            status: apiApt.status === 'scheduled' ? 'scheduled' : apiApt.status === 'in_progress' ? 'in-progress' : apiApt.status === 'completed' ? 'completed' : 'cancelled'
          }));
          setUpcomingAppointments(mappedAppointments);
        } else {
          console.error(appointmentsRes.message);
        }

        if (patientsRes.success && patientsRes.data) {
          const patientsData = (patientsRes as any).data;
          const patientsArray = Array.isArray(patientsData) ? patientsData : patientsData.patients || [];
          const mappedPatients: RecentPatient[] = patientsArray.slice(0, 5).map((apiPatient: any) => ({
            id: apiPatient._id || '',
            name: apiPatient.fullName || `${apiPatient.firstName} ${apiPatient.lastName || ''}`.trim(),
            lastVisit: new Date(apiPatient.createdAt || Date.now()),
            status: apiPatient.isActive ? 'active' : 'inactive'
          }));
          setRecentPatients(mappedPatients);
        } else {
          console.error(patientsRes.message);
        }

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return (
        <svg className="dashboard__trend-icon dashboard__trend-icon--up" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    } else if (trend < 0) {
      return (
        <svg className="dashboard__trend-icon dashboard__trend-icon--down" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="dashboard__trend-icon dashboard__trend-icon--neutral" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'dashboard__status--scheduled',
      'in-progress': 'dashboard__status--in-progress',
      completed: 'dashboard__status--completed',
      cancelled: 'dashboard__status--cancelled',
      active: 'dashboard__status--active',
      inactive: 'dashboard__status--inactive'
    };
    return colors[status as keyof typeof colors] || '';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'dashboard__priority--high',
      medium: 'dashboard__priority--medium',
      low: 'dashboard__priority--low'
    };
    return colors[priority as keyof typeof colors] || '';
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="dashboard__loading">
            <div className="dashboard__loading-content">
              <div className="loading-shimmer dashboard__loading-header"></div>
              <div className="dashboard__loading-grid">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="loading-shimmer dashboard__loading-card"></div>
                ))}
              </div>
              <div className="dashboard__loading-widgets">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="loading-shimmer dashboard__loading-widget"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard__header">
          <div className="dashboard__title-section">
            <h1 className="dashboard__title">Dashboard</h1>
            <p className="dashboard__subtitle">
              Bem-vindo de volta! Aqui está um resumo do seu consultório.
            </p>
          </div>
          <div className="dashboard__actions">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              size="sm"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Atualizar
            </Button>
            <Button variant="primary" size="sm">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nova Consulta
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dashboard__stats">
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon dashboard__stat-icon--patients">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div className="dashboard__stat-content">
              <div className="dashboard__stat-header">
                <h3 className="dashboard__stat-title">Total de Contatos</h3>
                <div className="dashboard__stat-trend">
                  <span className="dashboard__trend-value--neutral">0%</span>
                </div>
              </div>
              <div className="dashboard__stat-value">{stats.contacts.total.toLocaleString()}</div>
              <p className="dashboard__stat-description">total registrado</p>
            </div>
          </div>

          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon dashboard__stat-icon--appointments">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="dashboard__stat-content">
              <div className="dashboard__stat-header">
                <h3 className="dashboard__stat-title">Novos Esta Semana</h3>
                <div className="dashboard__stat-trend">
                  <span className="dashboard__trend-value--neutral">0%</span>
                </div>
              </div>
              <div className="dashboard__stat-value">{stats.summary.newThisWeek}</div>
              <p className="dashboard__stat-description">novos contatos</p>
            </div>
          </div>

          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon dashboard__stat-icon--revenue">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="dashboard__stat-content">
              <div className="dashboard__stat-header">
                <h3 className="dashboard__stat-title">Taxa de Conversão</h3>
                <div className="dashboard__stat-trend">
                  <span className="dashboard__trend-value--neutral">0%</span>
                </div>
              </div>
              <div className="dashboard__stat-value">{(stats.summary.conversionRate * 100).toFixed(1)}%</div>
              <p className="dashboard__stat-description">taxa de conversão</p>
            </div>
          </div>

          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon dashboard__stat-icon--satisfaction">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="dashboard__stat-content">
              <div className="dashboard__stat-header">
                <h3 className="dashboard__stat-title">Receita</h3>
                <div className="dashboard__stat-trend">
                  <span className="dashboard__trend-value--neutral">0%</span>
                </div>
              </div>
              <div className="dashboard__stat-value">{formatCurrency(parseFloat(stats.summary.revenue || '0'))}</div>
              <p className="dashboard__stat-description">receita total</p>
            </div>
          </div>
        </div>

        {/* Widgets */}
        <div className="dashboard__widgets">
          {/* Upcoming Appointments */}
          <div className="dashboard__widget">
            <div className="dashboard__widget-header">
              <h3 className="dashboard__widget-title">Próximas Consultas</h3>
              <Button variant="ghost" size="sm">Ver todas</Button>
            </div>
            <div className="dashboard__widget-content">
              {upcomingAppointments.length > 0 ? (
                <div className="dashboard__appointments-list">
                  {upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="dashboard__appointment-item">
                      <div className="dashboard__appointment-time">
                        {appointment.time}
                      </div>
                      <div className="dashboard__appointment-details">
                        <h4 className="dashboard__appointment-patient">{appointment.patientName}</h4>
                        <p className="dashboard__appointment-type">{appointment.type}</p>
                      </div>
                      <div className={`dashboard__appointment-status ${getStatusColor(appointment.status)}`}>
                        {appointment.status === 'scheduled' && 'Agendada'}
                        {appointment.status === 'in-progress' && 'Em andamento'}
                        {appointment.status === 'completed' && 'Concluída'}
                        {appointment.status === 'cancelled' && 'Cancelada'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard__empty-state">
                  <p>Nenhuma consulta agendada para hoje</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="dashboard__widget">
            <div className="dashboard__widget-header">
              <h3 className="dashboard__widget-title">Pacientes Recentes</h3>
              <Button variant="ghost" size="sm">Ver todos</Button>
            </div>
            <div className="dashboard__widget-content">
              {recentPatients.length > 0 ? (
                <div className="dashboard__patients-list">
                  {recentPatients.map(patient => (
                    <div key={patient.id} className="dashboard__patient-item">
                      <div className="dashboard__patient-avatar">
                        {patient.avatar ? (
                          <img src={patient.avatar} alt="" />
                        ) : (
                          <div className="dashboard__patient-avatar-placeholder">
                            {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="dashboard__patient-details">
                        <h4 className="dashboard__patient-name">{patient.name}</h4>
                        <p className="dashboard__patient-info">
                          Última visita: {formatDate(patient.lastVisit)}
                        </p>
                        {patient.nextAppointment && (
                          <p className="dashboard__patient-info">
                            Próxima: {formatDate(patient.nextAppointment)}
                          </p>
                        )}
                      </div>
                      <div className={`dashboard__patient-status ${getStatusColor(patient.status)}`}>
                        {patient.status === 'active' ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard__empty-state">
                  <p>Nenhum paciente recente</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="dashboard__widget">
            <div className="dashboard__widget-header">
              <h3 className="dashboard__widget-title">Tarefas Pendentes</h3>
              <Button variant="ghost" size="sm">Ver todas</Button>
            </div>
            <div className="dashboard__widget-content">
              {pendingTasks.length > 0 ? (
                <div className="dashboard__tasks-list">
                  {pendingTasks.map(task => (
                    <div key={task.id} className="dashboard__task-item">
                      <div className="dashboard__task-checkbox">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {
                            setPendingTasks(tasks => 
                              tasks.map(t => 
                                t.id === task.id ? { ...t, completed: !t.completed } : t
                              )
                            );
                          }}
                          aria-label={`Marcar tarefa "${task.title}" como ${task.completed ? 'pendente' : 'concluída'}`}
                        />
                      </div>
                      <div className="dashboard__task-content">
                        <h4 className={`dashboard__task-title ${task.completed ? 'dashboard__task-title--completed' : ''}`}>
                          {task.title}
                        </h4>
                        <p className="dashboard__task-due-date">
                          Prazo: {formatDate(task.dueDate)}
                        </p>
                      </div>
                      <div className={`dashboard__task-priority ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' && 'Alta'}
                        {task.priority === 'medium' && 'Média'}
                        {task.priority === 'low' && 'Baixa'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard__empty-state">
                  <p>Nenhuma tarefa pendente</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard__quick-actions">
          <h3 className="dashboard__quick-actions-title">Ações Rápidas</h3>
          <div className="dashboard__quick-actions-grid">
            <Button 
              variant="outline" 
              className="dashboard__quick-action"
              onClick={() => window.location.href = '/admin/patients'}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Novo Paciente
            </Button>
            
            <Button 
              variant="outline" 
              className="dashboard__quick-action"
              onClick={() => window.location.href = '/admin/appointments'}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Agendar Consulta
            </Button>
            
            <Button 
              variant="outline" 
              className="dashboard__quick-action"
              onClick={() => window.location.href = '/admin/billing'}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Gerar Fatura
            </Button>
            
            <Button 
              variant="outline" 
              className="dashboard__quick-action"
              onClick={() => window.location.href = '/admin/reports'}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Relatórios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;