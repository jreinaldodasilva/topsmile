// src/components/Clinical/MedicalHistory/AllergyManager.tsx
import React, { useState, useEffect } from 'react';
import { request } from '../../../services/http';
import './AllergyManager.css';

interface Allergy {
    allergen: string;
    reaction: string;
    severity: 'mild' | 'moderate' | 'severe';
}

interface AllergyManagerProps {
    allergies: Allergy[];
    onChange: (allergies: Allergy[]) => void;
}

export const AllergyManager: React.FC<AllergyManagerProps> = ({ allergies, onChange }) => {
    const [commonAllergies, setCommonAllergies] = useState<string[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [allergen, setAllergen] = useState('');
    const [reaction, setReaction] = useState('');
    const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');

    useEffect(() => {
        request('/api/medical-history/allergies/common')
            .then(res => (res.ok && res.data ? setCommonAllergies(res.data) : null))
            .catch(err => console.error('Error loading allergies:', err));
    }, []);

    const addAllergy = () => {
        if (!allergen || !reaction) return;
        onChange([...allergies, { allergen, reaction, severity }]);
        setAllergen('');
        setReaction('');
        setSeverity('moderate');
        setShowForm(false);
    };

    const removeAllergy = (index: number) => {
        onChange(allergies.filter((_, i) => i !== index));
    };

    const getSeverityColor = (sev: string) => {
        const colors = { mild: '#4caf50', moderate: '#ff9800', severe: '#f44336' };
        return colors[sev as keyof typeof colors] || '#999';
    };

    return (
        <div className="allergy-manager">
            <label>Alergias</label>

            {allergies.length > 0 && (
                <div className="allergy-list">
                    {allergies.map((allergy, idx) => (
                        <div
                            key={idx}
                            className="allergy-item"
                            style={{ borderLeftColor: getSeverityColor(allergy.severity) }}
                        >
                            <div className="allergy-info">
                                <strong>{allergy.allergen}</strong>
                                <span className="allergy-reaction">{allergy.reaction}</span>
                                <span className={`severity-badge ${allergy.severity}`}>
                                    {allergy.severity === 'mild'
                                        ? 'Leve'
                                        : allergy.severity === 'moderate'
                                          ? 'Moderada'
                                          : 'Grave'}
                                </span>
                            </div>
                            <button onClick={() => removeAllergy(idx)} className="remove-allergy">
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showForm ? (
                <div className="allergy-form">
                    <select value={allergen} onChange={e => setAllergen(e.target.value)}>
                        <option value="">Selecione ou digite...</option>
                        {commonAllergies.map(a => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Reação"
                        value={reaction}
                        onChange={e => setReaction(e.target.value)}
                    />
                    <select value={severity} onChange={e => setSeverity(e.target.value as any)}>
                        <option value="mild">Leve</option>
                        <option value="moderate">Moderada</option>
                        <option value="severe">Grave</option>
                    </select>
                    <button onClick={addAllergy} className="add-btn">
                        Adicionar
                    </button>
                    <button onClick={() => setShowForm(false)} className="cancel-btn">
                        Cancelar
                    </button>
                </div>
            ) : (
                <button onClick={() => setShowForm(true)} className="add-allergy-btn">
                    + Adicionar Alergia
                </button>
            )}
        </div>
    );
};
