// src/components/Clinical/MedicalHistory/AllergyAlert.tsx
import React, { useEffect, useState } from 'react';
import { request } from '../../../services/http';
import './AllergyAlert.css';

interface AllergyAlertProps {
    patientId: string;
}

export const AllergyAlert: React.FC<AllergyAlertProps> = ({ patientId }) => {
    const [allergies, setAllergies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        request(`/api/medical-history/patient/${patientId}/latest`)
            .then(res => {
                if (res.ok && res.data?.allergies) {
                    setAllergies(res.data.allergies);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [patientId]);

    if (loading || allergies.length === 0) return null;

    const severeAllergies = allergies.filter(a => a.severity === 'severe');

    return (
        <div className={`allergy-alert ${severeAllergies.length > 0 ? 'severe' : 'warning'}`}>
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
                <strong>ALERTA DE ALERGIA</strong>
                <div className="alert-list">
                    {allergies.map((allergy, idx) => (
                        <div key={idx} className="alert-item">
                            <span className="allergen">{allergy.allergen}</span>
                            <span className="reaction">({allergy.reaction})</span>
                            {allergy.severity === 'severe' && <span className="severe-badge">GRAVE</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
