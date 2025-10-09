// src/pages/Patient/Prescriptions/PatientPrescriptions.tsx
import React, { useState, useEffect } from 'react';
import { usePatientAuth } from '../../../contexts/PatientAuthContext';
import { clinicalService } from '../../../services/api';
import './PatientPrescriptions.css';

const PatientPrescriptions: React.FC = () => {
  const { patientUser } = usePatientAuth();
  const patient = patientUser?.patient;
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patient?._id) {
      loadPrescriptions();
    }
  }, [patient]);

  const loadPrescriptions = async () => {
    if (!patient?._id) return;
    
    setLoading(true);
    try {
      const result = await clinicalService.prescriptions.getAll(patient._id);
      if (result.success) {
        setPrescriptions(result.data || []);
      }
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-prescriptions">
      <h1>Minhas Prescrições</h1>
      
      {loading ? (
        <p>Carregando...</p>
      ) : prescriptions.length === 0 ? (
        <p>Nenhuma prescrição encontrada.</p>
      ) : (
        <div className="prescriptions-list">
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className="prescription-card">
              <div className="prescription-header">
                <h3>{prescription.medication}</h3>
                <span className="prescription-date">
                  {new Date(prescription.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="prescription-details">
                <p><strong>Dosagem:</strong> {prescription.dosage}</p>
                <p><strong>Frequência:</strong> {prescription.frequency}</p>
                <p><strong>Duração:</strong> {prescription.duration}</p>
                {prescription.instructions && (
                  <p><strong>Instruções:</strong> {prescription.instructions}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
