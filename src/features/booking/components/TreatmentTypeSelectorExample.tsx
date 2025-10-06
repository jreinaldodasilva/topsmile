// src/features/booking/components/TreatmentTypeSelectorExample.tsx
import React, { useEffect, useState } from 'react';
import { useBooking } from '../hooks/useBooking';

interface TreatmentType {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
}

interface TreatmentTypeSelectorExampleProps {
    clinicId: string;
    onSelect: (type: TreatmentType) => void;
}

export const TreatmentTypeSelectorExample: React.FC<TreatmentTypeSelectorExampleProps> = ({
    clinicId,
    onSelect
}) => {
    const { appointmentTypes, loading, error, getAppointmentTypes } = useBooking();
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        getAppointmentTypes(clinicId);
    }, [clinicId, getAppointmentTypes]);

    if (loading) return <div>Carregando tipos de consulta...</div>;
    if (error) return <div>Erro: {error}</div>;

    const categories = ['all', ...new Set(appointmentTypes.map(t => t.category))];
    const filteredTypes = selectedCategory === 'all'
        ? appointmentTypes
        : appointmentTypes.filter(t => t.category === selectedCategory);

    return (
        <div className="treatment-type-selector">
            <h3>Selecione o Tipo de Consulta</h3>

            <div className="category-filter">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat === 'all' ? 'Todos' : cat}
                    </button>
                ))}
            </div>

            <div className="types-grid">
                {filteredTypes.map(type => (
                    <div
                        key={type.id}
                        className="type-card"
                        onClick={() => onSelect(type)}
                    >
                        <h4>{type.name}</h4>
                        <p className="type-description">{type.description}</p>
                        <div className="type-details">
                            <span className="duration">⏱️ {type.duration} min</span>
                            <span className="price">R$ {type.price.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
