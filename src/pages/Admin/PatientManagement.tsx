// src/pages/Admin/PatientManagement.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import type { Patient } from '../../types/api';
import './PatientManagement.css';

interface PatientFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

const PatientManagement: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PatientFilters>({
    search: '',
    isActive: true,
    page: 1,
    limit: 20
  });
  const [total, setTotal] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch patients from backend
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Note: This would need to be implemented in the backend
      // For now, we'll create a mock implementation
      const mockPatients: Patient[] = [
        {
          _id: '1',
          firstName: 'João',
          lastName: 'Silva',
          fullName: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '(11) 99999-1111',
          dateOfBirth: '1985-03-15',
          gender: 'male',
          cpf: '123.456.789-00',
          address: {
            street: 'Rua das Flores',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567'
          },
          emergencyContact: {
            name: 'Maria Silva',
            phone: '(11) 99999-2222',
            relationship: 'Esposa'
          },
          medicalHistory: {
            allergies: ['Penicilina'],
            medications: [],
            conditions: ['Hipertensão'],
            notes: 'Paciente com histórico de hipertensão controlada'
          },
          clinic: user?.clinicId || 'clinic1',
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          _id: '2',
          firstName: 'Maria',
          lastName: 'Santos',
          fullName: 'Maria Santos',
          email: 'maria.santos@email.com',
          phone: '(11) 99999-3333',
          dateOfBirth: '1990-07-22',
          gender: 'female',
          cpf: '987.654.321-00',
          address: {
            street: 'Av. Paulista',
            number: '1000',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01310-100'
          },
          emergencyContact: {
            name: 'José Santos',
            phone: '(11) 99999-4444',
            relationship: 'Pai'
          },
          medicalHistory: {
            allergies: [],
            medications: ['Anticoncepcional'],
            conditions: [],
            notes: 'Paciente jovem, sem complicações'
          },
          clinic: user?.clinicId || 'clinic1',
          isActive: true,
          createdAt: '2024-01-20T14:30:00Z',
          updatedAt: '2024-01-20T14:30:00Z'
        },
        {
          _id: '3',
          firstName: 'Carlos',
          lastName: 'Oliveira',
          fullName: 'Carlos Oliveira',
          email: 'carlos.oliveira@email.com',
          phone: '(11) 99999-5555',
          dateOfBirth: '1975-12-10',
          gender: 'male',
          cpf: '456.789.123-00',
          address: {
            street: 'Rua Augusta',
            number: '500',
            neighborhood: 'Consolação',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01305-000'
          },
          emergencyContact: {
            name: 'Ana Oliveira',
            phone: '(11) 99999-6666',
            relationship: 'Esposa'
          },
          medicalHistory: {
            allergies: ['Látex'],
            medications: ['Losartana'],
            conditions: ['Diabetes Tipo 2'],
            notes: 'Paciente diabético, requer cuidados especiais'
          },
          clinic: user?.clinicId || 'clinic1',
          isActive: true,
          createdAt: '2024-01-10T09:15:00Z',
          updatedAt: '2024-01-25T16:45:00Z'
        }
      ];

      // Filter patients based on search
      let filteredPatients = mockPatients;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredPatients = mockPatients.filter(patient => 
          patient.fullName?.toLowerCase().includes(searchLower) ||
          patient.email?.toLowerCase().includes(searchLower) ||
          patient.phone?.includes(filters.search!) ||
          patient.cpf?.includes(filters.search!)
        );
      }

      if (filters.isActive !== undefined) {
        filteredPatients = filteredPatients.filter(patient => patient.isActive === filters.isActive);
      }

      setPatients(filteredPatients);
      setTotal(filteredPatients.length);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleFilterChange = (key: keyof PatientFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateAge = (dateOfBirth: string | Date | undefined) => {
    if (!dateOfBirth) return '-';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} anos`;
  };

  const getGenderLabel = (gender: string | undefined) => {
    const labels: Record<string, string> = {
      'male': 'Masculino',
      'female': 'Feminino',
      'other': 'Outro',
      'prefer_not_to_say': 'Prefere não dizer'
    };
    return labels[gender || ''] || '-';
  };

  if (loading && patients.length === 0) {
    return (
      <div className="patient-management">
        <div className="loading-container">
          <div className="loading-spinner">Carregando pacientes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Gestão de Pacientes</h1>
          <p>Gerencie os pacientes da sua clínica</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Novo Paciente
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="search-box">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nome, email, telefone ou CPF..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filters.isActive === undefined ? 'all' : filters.isActive.toString()}
              onChange={(e) => handleFilterChange('isActive', e.target.value === 'all' ? undefined : e.target.value === 'true')}
              className="filter-select"
            >
              <option value="all">Todos</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={fetchPatients} className="retry-button">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Results Summary */}
      <div className="results-summary">
        <span>{total} paciente{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</span>
        {loading && <span className="loading-indicator">Atualizando...</span>}
      </div>

      {/* Patients Table */}
      <div className="table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Contato</th>
              <th>Idade</th>
              <th>Gênero</th>
              <th>CPF</th>
              <th>Última Consulta</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-state">
                  <div className="empty-content">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3>Nenhum paciente encontrado</h3>
                    <p>Tente ajustar os filtros ou adicione um novo paciente</p>
                  </div>
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient._id} className="patient-row">
                  <td>
                    <div className="patient-info">
                      <div className="patient-name">{patient.fullName}</div>
                      <div className="patient-email">{patient.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{patient.phone}</div>
                    </div>
                  </td>
                  <td>{calculateAge(patient.dateOfBirth)}</td>
                  <td>{getGenderLabel(patient.gender)}</td>
                  <td>{patient.cpf || '-'}</td>
                  <td>{formatDate(patient.updatedAt)}</td>
                  <td>
                    <span className={`status-badge ${patient.isActive ? 'active' : 'inactive'}`}>
                      {patient.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setSelectedPatient(patient)}
                        title="Ver detalhes"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => {/* TODO: Edit patient */}}
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => {/* TODO: Schedule appointment */}}
                        title="Agendar consulta"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes do Paciente</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedPatient(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="patient-details">
                <div className="detail-section">
                  <h3>Informações Pessoais</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Nome Completo:</label>
                      <span>{selectedPatient.fullName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedPatient.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Telefone:</label>
                      <span>{selectedPatient.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Data de Nascimento:</label>
                      <span>{formatDate(selectedPatient.dateOfBirth)} ({calculateAge(selectedPatient.dateOfBirth)})</span>
                    </div>
                    <div className="detail-item">
                      <label>Gênero:</label>
                      <span>{getGenderLabel(selectedPatient.gender)}</span>
                    </div>
                    <div className="detail-item">
                      <label>CPF:</label>
                      <span>{selectedPatient.cpf}</span>
                    </div>
                  </div>
                </div>

                {selectedPatient.address && (
                  <div className="detail-section">
                    <h3>Endereço</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Endereço:</label>
                        <span>
                          {selectedPatient.address.street}, {selectedPatient.address.number}
                          {selectedPatient.address.neighborhood && ` - ${selectedPatient.address.neighborhood}`}
                        </span>
                      </div>
                      <div className="detail-item">
                        <label>Cidade/Estado:</label>
                        <span>{selectedPatient.address.city}/{selectedPatient.address.state}</span>
                      </div>
                      <div className="detail-item">
                        <label>CEP:</label>
                        <span>{selectedPatient.address.zipCode}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPatient.emergencyContact && (
                  <div className="detail-section">
                    <h3>Contato de Emergência</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Nome:</label>
                        <span>{selectedPatient.emergencyContact.name}</span>
                      </div>
                      <div className="detail-item">
                        <label>Telefone:</label>
                        <span>{selectedPatient.emergencyContact.phone}</span>
                      </div>
                      <div className="detail-item">
                        <label>Parentesco:</label>
                        <span>{selectedPatient.emergencyContact.relationship}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPatient.medicalHistory && (
                  <div className="detail-section">
                    <h3>Histórico Médico</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Alergias:</label>
                        <span>{selectedPatient.medicalHistory.allergies?.join(', ') || 'Nenhuma'}</span>
                      </div>
                      <div className="detail-item">
                        <label>Medicamentos:</label>
                        <span>{selectedPatient.medicalHistory.medications?.join(', ') || 'Nenhum'}</span>
                      </div>
                      <div className="detail-item">
                        <label>Condições:</label>
                        <span>{selectedPatient.medicalHistory.conditions?.join(', ') || 'Nenhuma'}</span>
                      </div>
                      {selectedPatient.medicalHistory.notes && (
                        <div className="detail-item full-width">
                          <label>Observações:</label>
                          <span>{selectedPatient.medicalHistory.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setSelectedPatient(null)}
              >
                Fechar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {/* TODO: Edit patient */}}
              >
                Editar Paciente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal Placeholder */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Novo Paciente</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <p>Formulário de cadastro de paciente em desenvolvimento...</p>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;