// src/components/PatientPortal/ConsentFormViewer.tsx
import React, { useState, useEffect } from 'react';
import { SignaturePad } from '../Clinical/ClinicalNotes/SignaturePad';
import './ConsentFormViewer.css';

interface ConsentForm {
  id: string;
  formType: string;
  title: string;
  content: string;
  status: string;
  signedAt?: string;
}

interface ConsentFormViewerProps {
  patientId: string;
}

export const ConsentFormViewer: React.FC<ConsentFormViewerProps> = ({ patientId }) => {
  const [forms, setForms] = useState<ConsentForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<ConsentForm | null>(null);
  const [showSignature, setShowSignature] = useState(false);

  useEffect(() => {
    fetchForms();
  }, [patientId]);

  const fetchForms = async () => {
    const res = await fetch(`/api/consent-forms/patient/${patientId}`);
    const data = await res.json();
    if (data.success) setForms(data.data);
  };

  const handleSign = async (signatureUrl: string) => {
    if (!selectedForm) return;

    await fetch(`/api/consent-forms/${selectedForm.id}/sign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signedBy: patientId,
        signatureUrl
      })
    });

    setShowSignature(false);
    setSelectedForm(null);
    fetchForms();
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pendente', className: 'status-pending' },
      signed: { label: 'Assinado', className: 'status-signed' },
      declined: { label: 'Recusado', className: 'status-declined' },
      expired: { label: 'Expirado', className: 'status-expired' }
    };
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge ${badge.className}`}>{badge.label}</span>;
  };

  return (
    <div className="consent-form-viewer">
      <h3>Termos de Consentimento</h3>

      <div className="forms-list">
        {forms.map(form => (
          <div key={form.id} className="form-item">
            <div className="form-header">
              <strong>{form.title}</strong>
              {getStatusBadge(form.status)}
            </div>
            {form.status === 'pending' && (
              <button
                onClick={() => setSelectedForm(form)}
                className="view-btn"
              >
                Visualizar e Assinar
              </button>
            )}
            {form.signedAt && (
              <span className="signed-date">
                Assinado em {new Date(form.signedAt).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        ))}
      </div>

      {selectedForm && !showSignature && (
        <div className="form-modal">
          <div className="form-content">
            <h2>{selectedForm.title}</h2>
            <div className="form-text">{selectedForm.content}</div>
            <div className="form-actions">
              <button onClick={() => setSelectedForm(null)} className="cancel-btn">
                Cancelar
              </button>
              <button onClick={() => setShowSignature(true)} className="sign-btn">
                Assinar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignature && (
        <SignaturePad
          onSave={handleSign}
          onCancel={() => setShowSignature(false)}
        />
      )}
    </div>
  );
};
