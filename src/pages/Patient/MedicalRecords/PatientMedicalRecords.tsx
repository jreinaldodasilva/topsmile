// src/pages/Patient/MedicalRecords/PatientMedicalRecords.tsx
import React, { useState, useEffect } from 'react';
import { usePatientAuth } from '../../../contexts/PatientAuthContext';
import { clinicalService } from '../../../services/api';
import './PatientMedicalRecords.css';

const PatientMedicalRecords: React.FC = () => {
  const { patientUser } = usePatientAuth();
  const patient = patientUser?.patient;
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'charts' | 'notes' | 'plans'>('charts');

  useEffect(() => {
    if (patient?._id) {
      loadRecords();
    }
  }, [patient, activeTab]);

  const loadRecords = async () => {
    if (!patient?._id) return;
    
    setLoading(true);
    try {
      let result;
      if (activeTab === 'charts') {
        result = await clinicalService.dentalCharts.getHistory(patient._id);
      } else if (activeTab === 'notes') {
        result = await clinicalService.clinicalNotes.getAll(patient._id);
      } else {
        result = await clinicalService.treatmentPlans.getAll(patient._id);
      }
      
      if (result.success) {
        setRecords(result.data || []);
      }
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-medical-records">
      <h1>Meus Registros Médicos</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'charts' ? 'active' : ''} 
          onClick={() => setActiveTab('charts')}
        >
          Odontogramas
        </button>
        <button 
          className={activeTab === 'notes' ? 'active' : ''} 
          onClick={() => setActiveTab('notes')}
        >
          Notas Clínicas
        </button>
        <button 
          className={activeTab === 'plans' ? 'active' : ''} 
          onClick={() => setActiveTab('plans')}
        >
          Planos de Tratamento
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : records.length === 0 ? (
        <p>Nenhum registro encontrado.</p>
      ) : (
        <div className="records-list">
          {records.map((record) => (
            <div key={record._id} className="record-card">
              <div className="record-date">
                {new Date(record.createdAt).toLocaleDateString('pt-BR')}
              </div>
              <div className="record-content">
                {activeTab === 'charts' && <p>Odontograma</p>}
                {activeTab === 'notes' && <p>{record.note || record.notes}</p>}
                {activeTab === 'plans' && (
                  <>
                    <h3>{record.title}</h3>
                    <p>{record.description}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientMedicalRecords;
