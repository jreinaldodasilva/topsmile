// src/components/PatientPortal/InsuranceForm.tsx
import React, { useState } from 'react';
import './InsuranceForm.css';

interface InsuranceFormProps {
  patientId: string;
  initialData?: any;
  onSave: (data: any) => void;
}

export const InsuranceForm: React.FC<InsuranceFormProps> = ({
  patientId,
  initialData,
  onSave
}) => {
  const [type, setType] = useState<'primary' | 'secondary'>(initialData?.type || 'primary');
  const [provider, setProvider] = useState(initialData?.provider || '');
  const [policyNumber, setPolicyNumber] = useState(initialData?.policyNumber || '');
  const [groupNumber, setGroupNumber] = useState(initialData?.groupNumber || '');
  const [subscriberName, setSubscriberName] = useState(initialData?.subscriberName || '');
  const [relationship, setRelationship] = useState(initialData?.subscriberRelationship || 'self');
  const [effectiveDate, setEffectiveDate] = useState(initialData?.effectiveDate || '');
  const [expirationDate, setExpirationDate] = useState(initialData?.expirationDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      patient: patientId,
      type,
      provider,
      policyNumber,
      groupNumber,
      subscriberName,
      subscriberRelationship: relationship,
      effectiveDate: new Date(effectiveDate),
      expirationDate: expirationDate ? new Date(expirationDate) : undefined
    });
  };

  return (
    <form className="insurance-form" onSubmit={handleSubmit}>
      <h3>Informações do Seguro</h3>

      <div className="form-row">
        <label>
          Tipo
          <select value={type} onChange={(e) => setType(e.target.value as any)} required>
            <option value="primary">Principal</option>
            <option value="secondary">Secundário</option>
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          Operadora
          <input
            type="text"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Número da Apólice
          <input
            type="text"
            value={policyNumber}
            onChange={(e) => setPolicyNumber(e.target.value)}
            required
          />
        </label>
        <label>
          Número do Grupo
          <input
            type="text"
            value={groupNumber}
            onChange={(e) => setGroupNumber(e.target.value)}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Nome do Titular
          <input
            type="text"
            value={subscriberName}
            onChange={(e) => setSubscriberName(e.target.value)}
            required
          />
        </label>
        <label>
          Relação
          <select value={relationship} onChange={(e) => setRelationship(e.target.value)} required>
            <option value="self">Próprio</option>
            <option value="spouse">Cônjuge</option>
            <option value="child">Filho(a)</option>
            <option value="other">Outro</option>
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          Data de Vigência
          <input
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            required
          />
        </label>
        <label>
          Data de Expiração
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="save-btn">Salvar Seguro</button>
    </form>
  );
};
