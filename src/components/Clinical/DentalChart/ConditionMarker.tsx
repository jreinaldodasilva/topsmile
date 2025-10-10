import React, { useState } from 'react';
import './ConditionMarker.css';

interface ConditionMarkerProps {
    toothNumber: string;
    onAddCondition: (condition: { type: string; status: string; surface?: string; notes?: string }) => void;
    onClose: () => void;
}

const conditionTypes = [
    { value: 'caries', label: 'Cárie' },
    { value: 'filling', label: 'Restauração' },
    { value: 'crown', label: 'Coroa' },
    { value: 'bridge', label: 'Ponte' },
    { value: 'implant', label: 'Implante' },
    { value: 'extraction', label: 'Extração' },
    { value: 'root_canal', label: 'Canal' },
    { value: 'missing', label: 'Ausente' },
    { value: 'other', label: 'Outro' }
];

const surfaces = [
    { value: 'O', label: 'Oclusal' },
    { value: 'M', label: 'Mesial' },
    { value: 'D', label: 'Distal' },
    { value: 'V', label: 'Vestibular' },
    { value: 'L', label: 'Lingual' }
];

export const ConditionMarker: React.FC<ConditionMarkerProps> = ({ toothNumber, onAddCondition, onClose }) => {
    const [type, setType] = useState('');
    const [status, setStatus] = useState<'existing' | 'planned'>('existing');
    const [surface, setSurface] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!type) return;

        onAddCondition({
            type,
            status,
            surface: surface || undefined,
            notes: notes || undefined
        });

        onClose();
    };

    return (
        <div className="condition-marker">
            <div className="marker-header">
                <h4>Marcar Condição - Dente {toothNumber}</h4>
                <button className="close-btn" onClick={onClose}>
                    ×
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tipo de Condição</label>
                    <select value={type} onChange={e => setType(e.target.value)} required>
                        <option value="">Selecione</option>
                        {conditionTypes.map(ct => (
                            <option key={ct.value} value={ct.value}>
                                {ct.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                value="existing"
                                checked={status === 'existing'}
                                onChange={e => setStatus(e.target.value as 'existing')}
                            />
                            Existente
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="planned"
                                checked={status === 'planned'}
                                onChange={e => setStatus(e.target.value as 'planned')}
                            />
                            Planejado
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Superfície (opcional)</label>
                    <select value={surface} onChange={e => setSurface(e.target.value)}>
                        <option value="">Nenhuma</option>
                        {surfaces.map(s => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Observações (opcional)</label>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Adicione observações..."
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit">Adicionar</button>
                </div>
            </form>
        </div>
    );
};
