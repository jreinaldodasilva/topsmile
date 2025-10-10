// src/components/Clinical/MedicalHistory/MedicationManager.tsx
import React, { useState } from 'react';
import './MedicationManager.css';

interface Medication {
    name: string;
    dosage?: string;
    frequency?: string;
}

interface MedicationManagerProps {
    medications: Medication[];
    onChange: (medications: Medication[]) => void;
}

export const MedicationManager: React.FC<MedicationManagerProps> = ({ medications, onChange }) => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');

    const addMedication = () => {
        if (!name) return;
        onChange([...medications, { name, dosage, frequency }]);
        setName('');
        setDosage('');
        setFrequency('');
        setShowForm(false);
    };

    const removeMedication = (index: number) => {
        onChange(medications.filter((_, i) => i !== index));
    };

    return (
        <div className="medication-manager">
            <label>Medicamentos em Uso</label>

            {medications.length > 0 && (
                <div className="medication-list">
                    {medications.map((med, idx) => (
                        <div key={idx} className="medication-item">
                            <div className="medication-info">
                                <strong>{med.name}</strong>
                                {med.dosage && <span>{med.dosage}</span>}
                                {med.frequency && <span>{med.frequency}</span>}
                            </div>
                            <button onClick={() => removeMedication(idx)} className="remove-med">
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showForm ? (
                <div className="medication-form">
                    <input
                        type="text"
                        placeholder="Nome do medicamento"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Dosagem (ex: 500mg)"
                        value={dosage}
                        onChange={e => setDosage(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Frequência (ex: 2x ao dia)"
                        value={frequency}
                        onChange={e => setFrequency(e.target.value)}
                    />
                    <button onClick={addMedication} className="add-btn">
                        Adicionar
                    </button>
                    <button onClick={() => setShowForm(false)} className="cancel-btn">
                        Cancelar
                    </button>
                </div>
            ) : (
                <button onClick={() => setShowForm(true)} className="add-medication-btn">
                    + Adicionar Medicamento
                </button>
            )}
        </div>
    );
};
