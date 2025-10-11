// src/components/Booking/TreatmentTypeSelector.tsx
import React, { useState } from 'react';
import { useAppointmentTypes } from '../../hooks/queries/useAppointmentTypes';
import './TreatmentTypeSelector.css';

interface TreatmentType {
    _id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
}

interface TreatmentTypeSelectorProps {
    clinicId: string;
    onSelect: (type: TreatmentType) => void;
}

export const TreatmentTypeSelector: React.FC<TreatmentTypeSelectorProps> = ({ clinicId, onSelect }) => {
    const { data: types = [] } = useAppointmentTypes(clinicId);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['all', ...Array.from(new Set(types.map(t => t.category)))];
    const filteredTypes = selectedCategory === 'all' ? types : types.filter(t => t.category === selectedCategory);

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
                    <div key={type._id} className="type-card" onClick={() => onSelect(type)}>
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
