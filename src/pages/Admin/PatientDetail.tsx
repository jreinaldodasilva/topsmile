import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DentalChart from '../../components/Clinical/DentalChart';
import TreatmentPlan from '../../components/Clinical/TreatmentPlan';
import ClinicalNotes from '../../components/Clinical/ClinicalNotes';

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
        {activeTab === 'treatment' && <TreatmentPlan patientId={id!} />}
        {activeTab === 'notes' && <ClinicalNotes patientId={id!} />}
      </div>
    </div>
  );
};

export default PatientDetail;
