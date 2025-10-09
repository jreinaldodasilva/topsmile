// src/pages/Patient/Documents/PatientDocuments.tsx
import React, { useState } from 'react';
import { usePatientAuth } from '../../../contexts/PatientAuthContext';
import './PatientDocuments.css';

const PatientDocuments: React.FC = () => {
  const { patientUser } = usePatientAuth();
  const patient = patientUser?.patient;
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // TODO: Implement file upload to backend
      console.log('Uploading files:', files);
      alert('Upload de documentos será implementado em breve');
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="patient-documents">
      <h1>Meus Documentos</h1>
      
      <div className="upload-section">
        <h2>Enviar Documento</h2>
        <input 
          type="file" 
          onChange={handleFileUpload}
          disabled={uploading}
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {uploading && <p>Enviando...</p>}
      </div>

      <div className="documents-list">
        <p>Nenhum documento enviado ainda.</p>
      </div>
    </div>
  );
};

export default PatientDocuments;
