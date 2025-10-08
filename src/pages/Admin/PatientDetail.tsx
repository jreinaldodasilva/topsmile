import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { DentalChart } from '../../components/Clinical/DentalChart';
import { TreatmentPlanView } from '../../components/Clinical/TreatmentPlan';
import { NotesTimeline } from '../../components/Clinical/ClinicalNotes';
import { MedicalHistoryForm } from '../../components/Clinical/MedicalHistory';
import type { Patient } from '@topsmile/types';

const TABS = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'chart', label: 'Odontograma' },
  { id: 'treatment', label: 'Plano de Tratamento' },
  { id: 'notes', label: 'Notas Clínicas' },
  { id: 'history', label: 'Histórico Médico' },
] as const;

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Patient>>({});
  const [saving, setSaving] = useState(false);
  const [treatmentPlans, setTreatmentPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState<any[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const result = await apiService.patients.getOne(id);
        if (result.success && result.data) {
          setPatient(result.data);
        } else {
          setError(result.message || 'Erro ao carregar paciente');
        }
      } catch (err) {
        setError('Erro ao carregar paciente');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'treatment' && id) {
      fetchTreatmentPlans();
    }
    if (activeTab === 'notes' && id) {
      fetchClinicalNotes();
    }
    if (activeTab === 'history' && id) {
      fetchMedicalHistory();
    }
  }, [activeTab, id]);

  const fetchTreatmentPlans = async () => {
    if (!id) return;
    try {
      setLoadingPlans(true);
      setPlansError(null);
      const result = await apiService.treatmentPlans.getAll(id);
      if (result.success && result.data) {
        setTreatmentPlans(result.data);
      } else {
        setPlansError(result.message || 'Erro ao carregar planos');
      }
    } catch (err: any) {
      setPlansError(err.message || 'Erro ao carregar planos de tratamento');
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchClinicalNotes = async () => {
    if (!id) return;
    try {
      setLoadingNotes(true);
      setNotesError(null);
      const result = await apiService.clinicalNotes.getAll(id);
      if (result.success && result.data) {
        setClinicalNotes(result.data);
      } else {
        setNotesError(result.message || 'Erro ao carregar notas');
      }
    } catch (err: any) {
      setNotesError(err.message || 'Erro ao carregar notas clínicas');
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleViewNote = (noteId: string) => {
    navigate(`/admin/clinical-notes/${noteId}`);
  };

  const fetchMedicalHistory = async () => {
    if (!id) return;
    try {
      setLoadingHistory(true);
      setHistoryError(null);
      const result = await apiService.medicalHistory.get(id);
      if (result.success && result.data) {
        setMedicalHistory(result.data);
      } else {
        setHistoryError(result.message || 'Erro ao carregar histórico');
      }
    } catch (err: any) {
      setHistoryError(err.message || 'Erro ao carregar histórico médico');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSaveMedicalHistory = async (data: any) => {
    if (!id) return;
    try {
      setHistoryError(null);
      const result = await apiService.medicalHistory.update(id, data);
      if (result.success) {
        setMedicalHistory(result.data);
        alert('Histórico médico salvo com sucesso!');
      } else {
        setHistoryError(result.message || 'Erro ao salvar histórico médico');
        alert(result.message || 'Erro ao salvar histórico médico');
      }
    } catch (err: any) {
      setHistoryError(err.message || 'Erro ao salvar histórico médico');
      alert(err.message || 'Erro ao salvar histórico médico');
    }
  };

  const handleEdit = () => {
    setEditData({
      firstName: patient?.firstName,
      lastName: patient?.lastName,
      email: patient?.email,
      phone: patient?.phone,
      cpf: patient?.cpf,
      dateOfBirth: patient?.dateOfBirth,
      gender: patient?.gender,
      address: patient?.address,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleSave = async () => {
    if (!id) return;
    
    // Validation
    if (!editData.firstName?.trim() || !editData.lastName?.trim()) {
      setSaveError('Nome e sobrenome são obrigatórios');
      return;
    }
    if (editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      setSaveError('Email inválido');
      return;
    }
    
    try {
      setSaving(true);
      setSaveError(null);
      const result = await apiService.patients.update(id, editData);
      if (result.success && result.data) {
        setPatient(result.data);
        setIsEditing(false);
        setEditData({});
      } else {
        setSaveError(result.message || 'Erro ao atualizar paciente');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Erro ao atualizar paciente');
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: 'red' }}>ID do paciente não fornecido</p>
        <button onClick={() => navigate('/admin/patients')}>Voltar</button>
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: '20px' }}>Carregando...</div>;
  }

  if (error || !patient) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: 'red' }}>{error || 'Paciente não encontrado'}</p>
        <button onClick={() => navigate('/admin/patients')}>Voltar</button>
      </div>
    );
  }



  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button onClick={() => navigate('/admin/patients')} style={{ marginBottom: '10px' }}>
            ← Voltar
          </button>
          <h1 style={{ margin: 0 }}>{patient.firstName} {patient.lastName}</h1>
          <p style={{ color: '#666', margin: '5px 0' }}>{patient.email}</p>
        </div>
      </div>

      <div style={{ borderBottom: '2px solid #e0e0e0', marginBottom: '20px' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #007bff' : '3px solid transparent',
              background: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              color: activeTab === tab.id ? '#007bff' : '#666',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Informações do Paciente</h2>
              {!isEditing ? (
                <button onClick={handleEdit} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                  Editar
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleCancel} style={{ padding: '8px 16px', cursor: 'pointer' }} disabled={saving}>
                    Cancelar
                  </button>
                  <button onClick={handleSave} style={{ padding: '8px 16px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none' }} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              )}
            </div>

            {saveError && (
              <div style={{ padding: '10px', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '15px' }}>
                <p style={{ color: 'red', margin: 0 }}>{saveError}</p>
              </div>
            )}

            {!isEditing ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <p><strong>Nome:</strong> {patient.firstName} {patient.lastName}</p>
                  <p><strong>Email:</strong> {patient.email || 'Não informado'}</p>
                  <p><strong>Telefone:</strong> {patient.phone || 'Não informado'}</p>
                  <p><strong>Data de Nascimento:</strong> {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('pt-BR') : 'Não informado'}</p>
                  <p><strong>Gênero:</strong> {patient.gender || 'Não informado'}</p>
                </div>
                <div>
                  <p><strong>Status:</strong> {patient.status}</p>
                  <p><strong>CPF:</strong> {patient.cpf || 'Não informado'}</p>
                  {patient.address && (
                    <>
                      <p><strong>Endereço:</strong></p>
                      <p style={{ marginLeft: '10px' }}>
                        {patient.address.street}, {patient.address.number}<br />
                        {patient.address.neighborhood}<br />
                        {patient.address.city} - {patient.address.state}<br />
                        CEP: {patient.address.zipCode}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome:</label>
                    <input
                      type="text"
                      value={editData.firstName || ''}
                      onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Sobrenome:</label>
                    <input
                      type="text"
                      value={editData.lastName || ''}
                      onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Telefone:</label>
                    <input
                      type="tel"
                      value={editData.phone || ''}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CPF:</label>
                    <input
                      type="text"
                      value={editData.cpf || ''}
                      onChange={(e) => setEditData({ ...editData, cpf: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data de Nascimento:</label>
                    <input
                      type="date"
                      value={editData.dateOfBirth ? new Date(editData.dateOfBirth).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Gênero:</label>
                    <select
                      value={editData.gender || ''}
                      onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                      <option value="">Selecione</option>
                      <option value="male">Masculino</option>
                      <option value="female">Feminino</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chart' && (
          <div>
            <DentalChart patientId={id!} />
          </div>
        )}

        {activeTab === 'treatment' && (
          <div>
            <h2>Planos de Tratamento</h2>
            {plansError && (
              <div style={{ padding: '10px', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '15px' }}>
                <p style={{ color: 'red', margin: 0 }}>{plansError}</p>
                <button onClick={fetchTreatmentPlans} style={{ marginTop: '10px', padding: '5px 10px' }}>Tentar Novamente</button>
              </div>
            )}
            {loadingPlans ? (
              <p>Carregando planos...</p>
            ) : !plansError && treatmentPlans.length === 0 ? (
              <p style={{ color: '#666' }}>Nenhum plano de tratamento encontrado.</p>
            ) : !plansError && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {treatmentPlans.map((plan) => (
                  <TreatmentPlanView key={plan._id} plan={plan} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <h2>Notas Clínicas</h2>
            {notesError && (
              <div style={{ padding: '10px', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '15px' }}>
                <p style={{ color: 'red', margin: 0 }}>{notesError}</p>
                <button onClick={fetchClinicalNotes} style={{ marginTop: '10px', padding: '5px 10px' }}>Tentar Novamente</button>
              </div>
            )}
            {loadingNotes ? (
              <p>Carregando notas...</p>
            ) : !notesError && (
              <NotesTimeline notes={clinicalNotes} onViewNote={handleViewNote} />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2>Histórico Médico</h2>
            {historyError && (
              <div style={{ padding: '10px', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '15px' }}>
                <p style={{ color: 'red', margin: 0 }}>{historyError}</p>
                <button onClick={fetchMedicalHistory} style={{ marginTop: '10px', padding: '5px 10px' }}>Tentar Novamente</button>
              </div>
            )}
            {loadingHistory ? (
              <p>Carregando histórico...</p>
            ) : !historyError && (
              <MedicalHistoryForm
                patientId={id}
                onSave={handleSaveMedicalHistory}
                initialData={medicalHistory}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
