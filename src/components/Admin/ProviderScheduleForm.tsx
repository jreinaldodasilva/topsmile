import React, { useState } from 'react';
import { Input, Button } from '../UI';

interface WorkingHours {
    [key: string]: {
        start: string;
        end: string;
        isWorking: boolean;
    };
}

interface ProviderScheduleFormProps {
    workingHours?: WorkingHours;
    bufferTimeBefore?: number;
    bufferTimeAfter?: number;
    onSave: (data: { workingHours: WorkingHours; bufferTimeBefore: number; bufferTimeAfter: number }) => Promise<void>;
}

const DAYS = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
];

export const ProviderScheduleForm: React.FC<ProviderScheduleFormProps> = ({
    workingHours: initialHours,
    bufferTimeBefore: initialBefore = 0,
    bufferTimeAfter: initialAfter = 0,
    onSave
}) => {
    const [workingHours, setWorkingHours] = useState<WorkingHours>(
        initialHours || {
            monday: { start: '08:00', end: '17:00', isWorking: true },
            tuesday: { start: '08:00', end: '17:00', isWorking: true },
            wednesday: { start: '08:00', end: '17:00', isWorking: true },
            thursday: { start: '08:00', end: '17:00', isWorking: true },
            friday: { start: '08:00', end: '17:00', isWorking: true },
            saturday: { start: '08:00', end: '12:00', isWorking: false },
            sunday: { start: '08:00', end: '12:00', isWorking: false }
        }
    );

    const [bufferTimeBefore, setBufferTimeBefore] = useState(initialBefore);
    const [bufferTimeAfter, setBufferTimeAfter] = useState(initialAfter);
    const [saving, setSaving] = useState(false);

    const handleDayToggle = (day: string) => {
        setWorkingHours({
            ...workingHours,
            [day]: {
                ...workingHours[day],
                isWorking: !workingHours[day].isWorking
            }
        });
    };

    const handleTimeChange = (day: string, field: 'start' | 'end', value: string) => {
        setWorkingHours({
            ...workingHours,
            [day]: {
                ...workingHours[day],
                [field]: value
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave({ workingHours, bufferTimeBefore, bufferTimeAfter });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <section>
                <h3>Horário de Trabalho</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {DAYS.map(({ key, label }) => (
                        <div
                            key={key}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '200px 1fr 1fr 100px',
                                gap: '15px',
                                alignItems: 'center',
                                padding: '10px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px'
                            }}
                        >
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={workingHours[key].isWorking}
                                    onChange={() => handleDayToggle(key)}
                                    style={{ marginRight: '10px' }}
                                />
                                <strong>{label}</strong>
                            </label>
                            <Input
                                label="Início"
                                type="time"
                                value={workingHours[key].start}
                                onChange={e => handleTimeChange(key, 'start', e.target.value)}
                                disabled={!workingHours[key].isWorking}
                            />
                            <Input
                                label="Fim"
                                type="time"
                                value={workingHours[key].end}
                                onChange={e => handleTimeChange(key, 'end', e.target.value)}
                                disabled={!workingHours[key].isWorking}
                            />
                            <span
                                style={{
                                    textAlign: 'center',
                                    color: workingHours[key].isWorking ? '#10b981' : '#6b7280'
                                }}
                            >
                                {workingHours[key].isWorking ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3>Tempo de Intervalo</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <Input
                        label="Antes da Consulta (minutos)"
                        type="number"
                        min="0"
                        max="60"
                        value={bufferTimeBefore}
                        onChange={e => setBufferTimeBefore(parseInt(e.target.value) || 0)}
                        helperText="Tempo de preparação antes da consulta"
                    />
                    <Input
                        label="Depois da Consulta (minutos)"
                        type="number"
                        min="0"
                        max="60"
                        value={bufferTimeAfter}
                        onChange={e => setBufferTimeAfter(parseInt(e.target.value) || 0)}
                        helperText="Tempo de limpeza/preparação após a consulta"
                    />
                </div>
            </section>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button type="submit" loading={saving}>
                    Salvar Horários
                </Button>
            </div>
        </form>
    );
};
