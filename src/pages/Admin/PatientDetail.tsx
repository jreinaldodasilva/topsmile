import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { DentalChart } from '../../components/Clinical/DentalChart';
import { TreatmentPlanView } from '../../components/Clinical/TreatmentPlan';
import { NotesTimeline } from '../../components/Clinical/ClinicalNotes';
import { MedicalHistoryForm } from '../../components/Clinical/MedicalHistory';
import { EnhancedPatientForm } from '../../components/Admin/Forms';
import { Modal, Button } from '../../components/UI';
import { EnhancedInsuranceForm } from '../../components/PatientPortal/EnhancedInsuranceForm';
import { PrescriptionForm, PrescriptionList } from '../../components/Clinical/Prescriptions';
import type { Patient } from '@topsmile/types';

const TABS = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'chart', label: 'Odontograma' },
  { id: 'treatment', label: 'Plano de Tratamento' },
  { id: 'notes', label: 'Notas Clínicas' },
  { id: 'history', label: 'Histórico Médico' },
  { id: 'insurance', label: 'Seguros' },
  { id: 'prescriptions', label: 'Receitas' },
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
  const [insurances, setInsurances] = useState<any[]>([]);
  const [loadingInsurances, setLoadingInsurances] = useState(false);
  const [insuranceError, setInsuranceError] = useState<string | null>(null);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<any>(null);
  const [insuranceType, setInsuranceType] = useState<'primary' | 'secondary'>('primary');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState<string | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

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
    if (activeTab === 'insurance' && id) {
      fetchInsurances();
    }
    if (activeTab === 'prescriptions' && id) {
      fetchPrescriptions();
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

  const fetchInsurances = async () => {
    if (!id) return;
    try {
      setLoadingInsurances(true);
      setInsuranceError(null);
      const result = await apiService.insurance.getAll(id);
      if (result.success && result.data) {
        setInsurances(result.data);
      } else {
        setInsuranceError(result.message || 'Erro ao carregar seguros');
      }
    } catch (err: any) {
      setInsuranceError(err.message || 'Erro ao carregar seguros');
    } finally {
      setLoadingInsurances(false);
    }
  };

  const handleSaveInsurance = async (data: any) => {
    if (!id) return;
    try {
      setInsuranceError(null);
      let result;
      if (editingInsurance) {
        result = await apiService.insurance.update(id, editingInsurance._id, data);
      } else {
        result = await apiService.insurance.create(id, data);
      }
      if (result.success) {
        await fetchInsurances();
        setShowInsuranceModal(false);
        setEditingInsurance(null);
      } else {
        setInsuranceError(result.message || 'Erro ao salvar seguro');
      }
    } catch (err: any) {
      setInsuranceError(err.message || 'Erro ao salvar seguro');
    }
  };

  const handleDeleteInsurance = async (insuranceId: string) => {
    if (!id || !window.confirm('Tem certeza que deseja excluir este seguro?')) return;
    try {
      const result = await apiService.insurance.delete(id, insuranceId);
      if (result.success) {
        await fetchInsurances();
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir seguro');
    }
  };

  const fetchPrescriptions = async () => {
    if (!id) return;
    try {
      setLoadingPrescriptions(true);
      setPrescriptionError(null);
      const result = await apiService.prescriptions.getAll(id);
      if (result.success && result.data) {
        setPrescriptions(result.data);
      } else {
        setPrescriptionError(result.message || 'Erro ao carregar receitas');
      }
    } catch (err: any) {
      setPrescriptionError(err.message || 'Erro ao carregar receitas');
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  const handleSavePrescription = async (data: any) => {
    try {
      const result = await apiService.prescriptions.create(data);
      if (result.success) {
        await fetchPrescriptions();
        setShowPrescriptionModal(false);
      } else {
        alert(result.message || 'Erro ao salvar receita');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar receita');
    }
  };

  const handleDeletePrescription = async (rxId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta receita?')) return;
    try {
      const result = await apiService.prescriptions.update(rxId, { status: 'cancelled' });
      if (result.success) {
        await fetchPrescriptions();
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir receita');
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
                  <p><strong>CPF:</strong> {patient.cpf || 'Não informado'}</p>
                </div>
                <div>
                  <p><strong>Status:</strong> {patient.status}</p>
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
                  {patient.emergencyContact && patient.emergencyContact.name && (
                    <>
                      <p><strong>Contato de Emergência:</strong></p>
                      <p style={{ marginLeft: '10px' }}>
                        {patient.emergencyContact.name}<br />
                        {patient.emergencyContact.phone}<br />
                        {patient.emergencyContact.relationship}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : null}
            {isEditing && (
              <Modal
                isOpen={isEditing}
                onClose={handleCancel}
                title="Editar Paciente"
                size="lg"
              >
                <EnhancedPatientForm
                  patient={patient}
                  onSave={async (data) => {
                    if (!id) return;
                    setSaving(true);
                    try {
                      const result = await apiService.patients.update(id, data);
                      if (result.success && result.data) {
                        setPatient(result.data);
                        setIsEditing(false);
                      } else {
                        alert(result.message || 'Erro ao atualizar paciente');
                      }
                    } catch (err: any) {
                      alert(err.message || 'Erro ao atualizar paciente');
                    } finally {
                      setSaving(false);
                    }
                  }}
                  onCancel={handleCancel}
                />
              </Modal>
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

        {activeTab === 'insurance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Seguros</h2>
              <Button onClick={() => { setInsuranceType('primary'); setEditingInsurance(null); setShowInsuranceModal(true); }}>
                Adicionar Seguro
              </Button>
            </div>
            {insuranceError && (
              <div style={{ padding: '10px', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '15px' }}>
                <p style={{ color: 'red', margin: 0 }}>{insuranceError}</p>
                <button onClick={fetchInsurances} style={{ marginTop: '10px', padding: '5px 10px' }}>Tentar Novamente</button>
              </div>
            )}
            {loadingInsurances ? (
              <p>Carregando seguros...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {insurances.length === 0 ? (
                  <p style={{ color: '#666' }}>Nenhum seguro cadastrado.</p>
                ) : (
                  insurances.map((ins) => (
                    <div key={ins._id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                        <div>
                          <h3 style={{ margin: 0 }}>{ins.provider}</h3>
                          <p style={{ color: '#666', margin: '5px 0' }}>Seguro {ins.type === 'primary' ? 'Principal' : 'Secundário'}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => { setEditingInsurance(ins); setInsuranceType(ins.type); setShowInsuranceModal(true); }} style={{ padding: '5px 10px' }}>Editar</button>
                          <button onClick={() => handleDeleteInsurance(ins._id)} style={{ padding: '5px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}>Excluir</button>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <p><strong>Apólice:</strong> {ins.policyNumber}</p>
                        <p><strong>Grupo:</strong> {ins.groupNumber || 'N/A'}</p>
                        <p><strong>Titular:</strong> {ins.subscriberName}</p>
                        <p><strong>Relacionamento:</strong> {ins.subscriberRelationship}</p>
                        <p><strong>Vigência:</strong> {new Date(ins.effectiveDate).toLocaleDateString('pt-BR')} - {ins.expirationDate ? new Date(ins.expirationDate).toLocaleDateString('pt-BR') : 'Indeterminado'}</p>
                        {ins.coverageDetails && (
                          <p><strong>Máximo Anual:</strong> R$ {ins.coverageDetails.annualMaximum?.toFixed(2) || '0.00'}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {showInsuranceModal && (
              <Modal
                isOpen={showInsuranceModal}
                onClose={() => { setShowInsuranceModal(false); setEditingInsurance(null); }}
                title={editingInsurance ? 'Editar Seguro' : 'Adicionar Seguro'}
                size="lg"
              >
                <EnhancedInsuranceForm
                  insurance={editingInsurance}
                  type={insuranceType}
                  onSave={handleSaveInsurance}
                  onCancel={() => { setShowInsuranceModal(false); setEditingInsurance(null); }}
                />
              </Modal>
            )}
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Receitas</h2>
              <Button onClick={() => setShowPrescriptionModal(true)}>Nova Receita</Button>
            </div>
            {prescriptionError && (
              <div style={{ padding: '10px', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '15px' }}>
                <p style={{ color: 'red', margin: 0 }}>{prescriptionError}</p>
                <button onClick={fetchPrescriptions} style={{ marginTop: '10px', padding: '5px 10px' }}>Tentar Novamente</button>
              </div>
            )}
            {loadingPrescriptions ? (
              <p>Carregando receitas...</p>
            ) : (
              <PrescriptionList
                prescriptions={prescriptions}
                onView={(id) => console.log('View', id)}
                onEdit={(rx) => console.log('Edit', rx)}
                onDelete={handleDeletePrescription}
              />
            )}
            {showPrescriptionModal && (
              <Modal
                isOpen={showPrescriptionModal}
                onClose={() => setShowPrescriptionModal(false)}
                title="Nova Receita"
                size="lg"
              >
                <PrescriptionForm
                  patientId={id!}
                  providerId={patient?.clinic as string || ''}
                  onSave={handleSavePrescription}
                  onCancel={() => setShowPrescriptionModal(false)}
                />
              </Modal>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
