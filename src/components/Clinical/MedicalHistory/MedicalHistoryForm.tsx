// src/components/Clinical/MedicalHistory/MedicalHistoryForm.tsx
import React, { useState, useEffect } from 'react';
import { AllergyManager } from './AllergyManager';
import { MedicationManager } from './MedicationManager';
import './MedicalHistoryForm.css';

interface MedicalHistoryFormProps {
  patientId: string;
  onSave: (data: any) => void;
  initialData?: any;
}

export const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({
  patientId,
  onSave,
  initialData
}) => {
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [dentalConditions, setDentalConditions] = useState<string[]>([]);
  const [selectedMedical, setSelectedMedical] = useState<string[]>(initialData?.chronicConditions || []);
  const [selectedDental, setSelectedDental] = useState<string[]>(initialData?.pastDentalHistory || []);
  const [chiefComplaint, setChiefComplaint] = useState(initialData?.chiefComplaint || '');
  const [medications, setMedications] = useState(initialData?.medications || []);
  const [allergies, setAllergies] = useState(initialData?.allergies || []);
  const [smoking, setSmoking] = useState(initialData?.socialHistory?.smoking || 'never');
  const [alcohol, setAlcohol] = useState(initialData?.socialHistory?.alcohol || 'never');

  useEffect(() => {
    fetch('/api/medical-history/conditions/medical')
      .then(res => res.json())
      .then(data => setMedicalConditions(data.data));

    fetch('/api/medical-history/conditions/dental')
      .then(res => res.json())
      .then(data => setDentalConditions(data.data));
  }, []);

  const toggleCondition = (condition: string, list: string[], setter: (val: string[]) => void) => {
    if (list.includes(condition)) {
      setter(list.filter(c => c !== condition));
    } else {
      setter([...list, condition]);
    }
  };

  const handleSubmit = () => {
    const data = {
      patient: patientId,
      chiefComplaint,
      chronicConditions: selectedMedical,
      pastDentalHistory: selectedDental,
      medications,
      allergies,
      socialHistory: { smoking, alcohol }
    };
    onSave(data);
  };

  return (
    <div className="medical-history-form">
      <div className="form-section">
        <label>Queixa Principal</label>
        <textarea
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          placeholder="Descreva a queixa principal do paciente..."
          rows={3}
        />
      </div>

      <div className="form-section">
        <label>Condições Médicas</label>
        <div className="conditions-grid">
          {medicalConditions.map(condition => (
            <label key={condition} className="condition-checkbox">
              <input
                type="checkbox"
                checked={selectedMedical.includes(condition)}
                onChange={() => toggleCondition(condition, selectedMedical, setSelectedMedical)}
              />
              <span>{condition}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <label>Histórico Odontológico</label>
        <div className="conditions-grid">
          {dentalConditions.map(condition => (
            <label key={condition} className="condition-checkbox">
              <input
                type="checkbox"
                checked={selectedDental.includes(condition)}
                onChange={() => toggleCondition(condition, selectedDental, setSelectedDental)}
              />
              <span>{condition}</span>
            </label>
          ))}
        </div>
      </div>

      <AllergyManager
        allergies={allergies}
        onChange={setAllergies}
      />

      <MedicationManager
        medications={medications}
        onChange={setMedications}
      />

      <div className="form-section">
        <label>Histórico Social</label>
        <div className="social-history">
          <div className="social-item">
            <span>Tabagismo:</span>
            <select value={smoking} onChange={(e) => setSmoking(e.target.value)}>
              <option value="never">Nunca</option>
              <option value="former">Ex-fumante</option>
              <option value="current">Fumante</option>
            </select>
          </div>
          <div className="social-item">
            <span>Álcool:</span>
            <select value={alcohol} onChange={(e) => setAlcohol(e.target.value)}>
              <option value="never">Nunca</option>
              <option value="occasional">Ocasional</option>
              <option value="regular">Regular</option>
            </select>
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} className="save-history-btn">
        Salvar Histórico Médico
      </button>
    </div>
  );
};
