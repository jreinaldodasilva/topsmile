import React, { useState } from 'react';
import { Input, Button } from '../../UI';

interface PrescriptionFormProps {
    patientId: string;
    providerId: string;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ patientId, providerId, onSave, onCancel }) => {
    const [medications, setMedications] = useState([
        { name: '', dosage: '', frequency: '', duration: '', quantity: 1, instructions: '' }
    ]);
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const addMedication = () => {
        setMedications([
            ...medications,
            { name: '', dosage: '', frequency: '', duration: '', quantity: 1, instructions: '' }
        ]);
    };

    const removeMedication = (index: number) => {
        setMedications(medications.filter((_, i) => i !== index));
    };

    const updateMedication = (index: number, field: string, value: any) => {
        const updated = [...medications];
        updated[index] = { ...updated[index], [field]: value };
        setMedications(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave({
                patient: patientId,
                provider: providerId,
                medications,
                diagnosis,
                notes,
                prescribedDate: new Date().toISOString()
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
                label="Diagnóstico"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                placeholder="CID ou descrição"
            />

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h3>Medicamentos</h3>
                    <Button type="button" variant="outline" onClick={addMedication}>
                        + Adicionar
                    </Button>
                </div>
                {medications.map((med, i) => (
                    <div
                        key={i}
                        style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '15px',
                            marginBottom: '15px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <strong>Medicamento {i + 1}</strong>
                            {medications.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeMedication(i)}
                                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                                >
                                    Remover
                                </button>
                            )}
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr',
                                gap: '10px',
                                marginBottom: '10px'
                            }}
                        >
                            <Input
                                label="Nome *"
                                value={med.name}
                                onChange={e => updateMedication(i, 'name', e.target.value)}
                                required
                            />
                            <Input
                                label="Dosagem *"
                                value={med.dosage}
                                onChange={e => updateMedication(i, 'dosage', e.target.value)}
                                placeholder="500mg"
                                required
                            />
                            <Input
                                label="Qtd *"
                                type="number"
                                min="1"
                                value={med.quantity}
                                onChange={e => updateMedication(i, 'quantity', parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '10px',
                                marginBottom: '10px'
                            }}
                        >
                            <Input
                                label="Frequência *"
                                value={med.frequency}
                                onChange={e => updateMedication(i, 'frequency', e.target.value)}
                                placeholder="8/8h"
                                required
                            />
                            <Input
                                label="Duração *"
                                value={med.duration}
                                onChange={e => updateMedication(i, 'duration', e.target.value)}
                                placeholder="7 dias"
                                required
                            />
                        </div>
                        <Input
                            label="Instruções"
                            value={med.instructions}
                            onChange={e => updateMedication(i, 'instructions', e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Observações..."
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={onCancel} disabled={saving}>
                    Cancelar
                </Button>
                <Button type="submit" loading={saving}>
                    Salvar Receita
                </Button>
            </div>
        </form>
    );
};
