// src/components/Calendar/Enhanced/OperatoryAssignment.tsx
import React, { useState, useEffect } from 'react';
import './OperatoryAssignment.css';

interface OperatoryAssignmentProps {
    appointmentId: string;
    currentOperatory?: string;
    onAssign: (operatory: string) => void;
}

export const OperatoryAssignment: React.FC<OperatoryAssignmentProps> = ({
    appointmentId,
    currentOperatory,
    onAssign
}) => {
    const [operatories, setOperatories] = useState<any[]>([]);
    const [selected, setSelected] = useState(currentOperatory || '');

    useEffect(() => {
        fetch('/api/operatories')
            .then(res => res.json())
            .then(data => {
                if (data.success) setOperatories(data.data);
            });
    }, []);

    const handleAssign = () => {
        if (selected) {
            onAssign(selected);
        }
    };

    return (
        <div className="operatory-assignment">
            <label>Operatório / Sala</label>
            <select value={selected} onChange={e => setSelected(e.target.value)} className="operatory-select">
                <option value="">Nenhum</option>
                {operatories.map(op => (
                    <option key={op.id} value={op.name}>
                        {op.name} - {op.room}
                    </option>
                ))}
            </select>
            <button onClick={handleAssign} className="assign-btn">
                Atribuir
            </button>
        </div>
    );
};
