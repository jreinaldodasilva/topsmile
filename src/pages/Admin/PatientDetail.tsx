import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DentalChart } from '../../components/Clinical/DentalChart';
import { TreatmentPlanView } from '../../components/Clinical/TreatmentPlan';
import { ClinicalNoteEditor } from '../../components/Clinical/ClinicalNotes';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('chart');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Patient Details</h1>
      
      <div style={{ borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('chart')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'chart' ? '2px solid #007bff' : 'none',
            background: 'none',
            cursor: 'pointer'
          }}
        >
          Dental Chart
        </button>
        <button
          onClick={() => setActiveTab('treatment')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'treatment' ? '2px solid #007bff' : 'none',
            background: 'none',
            cursor: 'pointer'
          }}
        >
          Treatment Plan
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'notes' ? '2px solid #007bff' : 'none',
            background: 'none',
            cursor: 'pointer'
          }}
        >
          Clinical Notes
        </button>
      </div>

      <div>
        {activeTab === 'chart' && <DentalChart patientId={id!} />}
        {activeTab === 'treatment' && (
          <TreatmentPlanView 
            plan={{ 
              title: 'Treatment Plan', 
              status: 'draft', 
              phases: [], 
              totalCost: 0, 
              totalInsuranceCoverage: 0, 
              totalPatientCost: 0 
            }} 
          />
        )}
        {activeTab === 'notes' && (
          <ClinicalNoteEditor 
            patientId={id!} 
            providerId="current-provider-id" 
            onSave={(note) => console.log('Note saved:', note)} 
          />
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
