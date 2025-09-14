import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/apiService';
import { Patient } from '../../../types/api';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';
import { useAuth } from '../../../contexts/AuthContext';

// Enhanced Patient Management Component with Full Backend Integration
const PatientManagement: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  
  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | ''>('active');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Load patients with enhanced backend integration
  const loadPatients = async (page = 1, search = '', status = '') => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.patients.getAll({
        page,
        limit: 20,
        search: search.trim() || undefined,
        status: status as 'active' | 'inactive' || 'active',
        sortBy: 'name',
        sortOrder: 'asc'
      });

      if (response.success && response.data) {
        setPatients(response.data.patients || []);
        setTotalPages(response.data.pagination?.pages || 1);
        setCurrentPage(response.data.pagination?.page || 1);
      } else {
        setError(response.message || 'Erro ao carregar pacientes');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de rede');
    } finally {
      setLoading(false);
    }
  };

  // Load patient statistics
  const loadStats = async () => {
    try {
      const response = await apiService.patients.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error loading patient stats:', err);
    }
  };

  useEffect(() => {
    loadPatients(currentPage, searchTerm, statusFilter);
    loadStats();
  }, [currentPage, statusFilter]);

  // Search handler with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPatients(1, searchTerm, statusFilter);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Create patient with backend field mapping
  const createPatient = async (patientData: Partial<Patient>) => {
    try {
      setLoading(true);
      const response = await apiService.patients.create(patientData);
      
      if (response.success) {
        setShowCreateModal(false);
        loadPatients(currentPage, searchTerm, statusFilter);
        alert('Paciente criado com sucesso!');
      } else {
        alert(response.message || 'Erro ao criar paciente');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao criar paciente');
    } finally {
      setLoading(false);
    }
  };

  // Update patient with backend integration
  const updatePatient = async (id: string, patientData: Partial<Patient>) => {
    try {
      setLoading(true);
      const response = await apiService.patients.update(id, patientData);
      
      if (response.success) {
        setShowEditModal(false);
        setSelectedPatient(null);
        loadPatients(currentPage, searchTerm, statusFilter);
        alert('Paciente atualizado com sucesso!');
      } else {
        alert(response.message || 'Erro ao atualizar paciente');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar paciente');
    } finally {
      setLoading(false);
    }
  };

  // Update medical history using backend-specific endpoint
  const updateMedicalHistory = async (id: string, medicalHistory: any) => {
    try {
      setLoading(true);
      const response = await apiService.patients.updateMedicalHistory(id, medicalHistory);
      
      if (response.success) {
        setShowMedicalHistoryModal(false);
        setSelectedPatient(null);
        loadPatients(currentPage, searchTerm, statusFilter);
        alert('Histórico médico atualizado com sucesso!');
      } else {
        alert(response.message || 'Erro ao atualizar histórico médico');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar histórico médico');
    } finally {
      setLoading(false);
    }
  };

  // Reactivate patient using backend-specific endpoint
  const reactivatePatient = async (id: string) => {
    if (!window.confirm('Deseja reativar este paciente?')) return;

    try {
      setLoading(true);
      const response = await apiService.patients.reactivate(id);
      
      if (response.success) {
        loadPatients(currentPage, searchTerm, statusFilter);
        alert('Paciente reativado com sucesso!');
      } else {
        alert(response.message || 'Erro ao reativar paciente');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao reativar paciente');
    } finally {
      setLoading(false);
    }
  };

  // Delete patient
  const deletePatient = async (id: string) => {
    if (!window.confirm('Deseja realmente excluir este paciente? Esta ação não pode ser desfeita.')) return;

    try {
      setLoading(true);
      const response = await apiService.patients.delete(id);
      
      if (response.success) {
        loadPatients(currentPage, searchTerm, statusFilter);
        alert('Paciente excluído com sucesso!');
      } else {
        alert(response.message || 'Erro ao excluir paciente');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-management">
      {/* Header with Statistics */}
      <div className="management-header">
        <h2>Gerenciamento de Pacientes</h2>
        
        {stats && (
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.active}</span>
              <span className="stat-label">Ativos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.inactive}</span>
              <span className="stat-label">Inativos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.newThisMonth}</span>
              <span className="stat-label">Novos este Mês</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="management-controls">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="status-filter"
          >
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="">Todos</option>
          </select>
        </div>
        
        <Button 
          onClick={() => setShowCreateModal(true)}
          disabled={loading}
        >
          + Novo Paciente
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => loadPatients(currentPage, searchTerm, statusFilter)}
          >
            Tentar Novamente
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner">Carregando pacientes...</div>
        </div>
      )}

      {/* Patients Table */}
      {!loading && (
        <div className="patients-table-container">
          {patients.length > 0 ? (
            <>
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>CPF</th>
                    <th>Data Nascimento</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => {
                    const patientId = patient._id || patient.id;
                    const displayName = patient.fullName || patient.name || 
                      (patient.firstName ? `${patient.firstName} ${patient.lastName || ''}`.trim() : 'Sem nome');
                    const birthDate = patient.dateOfBirth || patient.birthDate;
                    const isActive = patient.status === 'active' || patient.isActive;

                    return (
                      <tr key={patientId} className={!isActive ? 'inactive-row' : ''}>
                        <td>
                          <div className="patient-name">
                            {displayName}
                            {!isActive && <span className="inactive-badge">Inativo</span>}
                          </div>
                        </td>
                        <td>{patient.email || '-'}</td>
                        <td>
                          {patient.phone && (
                            <a href={`tel:${patient.phone}`}>{patient.phone}</a>
                          )}
                        </td>
                        <td>{patient.cpf || '-'}</td>
                        <td>
                          {birthDate ? new Date(birthDate).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td>
                          <span className={`status-badge status-${isActive ? 'active' : 'inactive'}`}>
                            {isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setShowEditModal(true);
                              }}
                            >
                              Editar
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setShowMedicalHistoryModal(true);
                              }}
                            >
                              Histórico
                            </Button>
                            
                            {!isActive && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => reactivatePatient(patientId)}
                              >
                                Reativar
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deletePatient(patientId)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Anterior
                  </Button>
                  
                  <span className="page-info">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>Nenhum paciente encontrado</h3>
              <p>
                {searchTerm ? 
                  'Nenhum paciente corresponde aos critérios de busca.' :
                  'Você ainda não cadastrou nenhum paciente.'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Patient Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Novo Paciente"
        size="lg"
      >
        <PatientForm 
          onSubmit={createPatient}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPatient(null);
        }}
        title="Editar Paciente"
        size="lg"
      >
        {selectedPatient && (
          <PatientForm 
            patient={selectedPatient}
            onSubmit={(data) => updatePatient(selectedPatient._id || selectedPatient.id!, data)}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedPatient(null);
            }}
          />
        )}
      </Modal>

      {/* Medical History Modal */}
      <Modal
        isOpen={showMedicalHistoryModal}
        onClose={() => {
          setShowMedicalHistoryModal(false);
          setSelectedPatient(null);
        }}
        title="Histórico Médico"
        size="lg"
      >
        {selectedPatient && (
          <MedicalHistoryForm 
            patient={selectedPatient}
            onSubmit={(data) => updateMedicalHistory(selectedPatient._id || selectedPatient.id!, data)}
            onCancel={() => {
              setShowMedicalHistoryModal(false);
              setSelectedPatient(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

// Patient Form Component with Backend Field Mapping
const PatientForm: React.FC<{
  patient?: Patient;
  onSubmit: (data: Partial<Patient>) => void;
  onCancel: () => void;
}> = ({ patient, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || (patient?.name ? patient.name.split(' ')[0] : ''),
    lastName: patient?.lastName || (patient?.name ? patient.name.split(' ').slice(1).join(' ') : ''),
    email: patient?.email || '',
    phone: patient?.phone || '',
    dateOfBirth: patient?.dateOfBirth || patient?.birthDate || '',
    gender: patient?.gender || '',
    cpf: patient?.cpf || '',
    address: {
      street: patient?.address?.street || '',
      number: patient?.address?.number || '',
      complement: patient?.address?.complement || '',
      neighborhood: patient?.address?.neighborhood || '',
      city: patient?.address?.city || '',
      state: patient?.address?.state || '',
      zipCode: patient?.address?.zipCode || ''
    },
    emergencyContact: {
      name: patient?.emergencyContact?.name || '',
      phone: patient?.emergencyContact?.phone || '',
      relationship: patient?.emergencyContact?.relationship || ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="patient-form">
      {/* Personal Information */}
      <div className="form-section">
        <h3>Informações Pessoais</h3>
        
        <div className="form-row">
          <div className="form-field">
            <label>Nome *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          
          <div className="form-field">
            <label>Sobrenome</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="form-field">
            <label>Telefone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Data de Nascimento</label>
            <input
              type="date"
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
            />
          </div>
          
          <div className="form-field">
            <label>Gênero</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
            >
              <option value="">Selecione</option>
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
              <option value="other">Outro</option>
              <option value="prefer_not_to_say">Prefiro não dizer</option>
            </select>
          </div>
          
          <div className="form-field">
            <label>CPF</label>
            <input
              type="text"
              value={formData.cpf}
              onChange={(e) => setFormData({...formData, cpf: e.target.value})}
              placeholder="000.000.000-00"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="form-section">
        <h3>Endereço</h3>
        
        <div className="form-row">
          <div className="form-field">
            <label>Rua</label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => setFormData({
                ...formData, 
                address: {...formData.address, street: e.target.value}
              })}
            />
          </div>
          
          <div className="form-field">
            <label>Número</label>
            <input
              type="text"
              value={formData.address.number}
              onChange={(e) => setFormData({
                ...formData, 
                address: {...formData.address, number: e.target.value}
              })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Complemento</label>
            <input
              type="text"
              value={formData.address.complement}
              onChange={(e) => setFormData({
                ...formData, 
                address: {...formData.address, complement: e.target.value}
              })}
            />
          </div>
          
          <div className="form-field">
            <label>Bairro</label>
            <input
              type="text"
              value={formData.address.neighborhood}
              onChange={(e) => setFormData({
                ...formData, 
                address: {...formData.address, neighborhood: e.target.value}
              })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Cidade</label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => setFormData({
                ...formData, 
                address: {...formData.address, city: e.target.value}
              })}
            />
          </div>
          
          <div className="form-field">
            <label>Estado</label>
            <input
              type="text"
              value={formData.address.state}
              onChange={(e) => setFormData({
                ...formData, 
                address: {...formData.address, state: e.target.value}
              })}
            />
          </div>
          
          <div className="form-field">
            <label>CEP</label>
            <input
              type="text"
              value={formData.address.zipCode}
              onChange={(e) => setFormData({
                ...formData, 
                address: {...formData.address, zipCode: e.target.value}
              })}
              placeholder="00000-000"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="form-section">
        <h3>Contato de Emergência</h3>
        
        <div className="form-row">
          <div className="form-field">
            <label>Nome</label>
            <input
              type="text"
              value={formData.emergencyContact.name}
              onChange={(e) => setFormData({
                ...formData, 
                emergencyContact: {...formData.emergencyContact, name: e.target.value}
              })}
            />
          </div>
          
          <div className="form-field">
            <label>Telefone</label>
            <input
              type="tel"
              value={formData.emergencyContact.phone}
              onChange={(e) => setFormData({
                ...formData, 
                emergencyContact: {...formData.emergencyContact, phone: e.target.value}
              })}
            />
          </div>
          
          <div className="form-field">
            <label>Parentesco</label>
            <input
              type="text"
              value={formData.emergencyContact.relationship}
              onChange={(e) => setFormData({
                ...formData, 
                emergencyContact: {...formData.emergencyContact, relationship: e.target.value}
              })}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {patient ? 'Atualizar' : 'Criar'} Paciente
        </Button>
      </div>
    </form>
  );
};

// Medical History Form Component
const MedicalHistoryForm: React.FC<{
  patient: Patient;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ patient, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    allergies: patient.medicalHistory?.allergies || [],
    medications: patient.medicalHistory?.medications || [],
    conditions: patient.medicalHistory?.conditions || [],
    notes: patient.medicalHistory?.notes || ''
  });

  const handleArrayFieldChange = (field: 'allergies' | 'medications' | 'conditions', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({...formData, [field]: items});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="medical-history-form">
      <div className="form-field">
        <label>Alergias (separadas por vírgula)</label>
        <input
          type="text"
          value={formData.allergies.join(', ')}
          onChange={(e) => handleArrayFieldChange('allergies', e.target.value)}
          placeholder="Ex: Penicilina, Látex, Nozes"
        />
      </div>

      <div className="form-field">
        <label>Medicamentos em Uso (separados por vírgula)</label>
        <input
          type="text"
          value={formData.medications.join(', ')}
          onChange={(e) => handleArrayFieldChange('medications', e.target.value)}
          placeholder="Ex: Aspirina, Vitamina D"
        />
      </div>

      <div className="form-field">
        <label>Condições Médicas (separadas por vírgula)</label>
        <input
          type="text"
          value={formData.conditions.join(', ')}
          onChange={(e) => handleArrayFieldChange('conditions', e.target.value)}
          placeholder="Ex: Diabetes, Hipertensão"
        />
      </div>

      <div className="form-field">
        <label>Observações Adicionais</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          rows={4}
          placeholder="Informações adicionais sobre o histórico médico..."
        />
      </div>

      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Histórico
        </Button>
      </div>
    </form>
  );
};

export default PatientManagement;