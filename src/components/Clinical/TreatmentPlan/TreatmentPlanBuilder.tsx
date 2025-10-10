// src/components/Clinical/TreatmentPlan/TreatmentPlanBuilder.tsx
import React, { useState, useEffect } from 'react';
import { ProcedureSelector } from './ProcedureSelector';
import { PhaseManager } from './PhaseManager';
import { CostBreakdown } from './CostBreakdown';
import './TreatmentPlanBuilder.css';

interface Procedure {
    code: string;
    description: string;
    tooth?: string;
    surface?: string;
    cost: number;
    insuranceCoverage?: number;
    patientCost?: number;
}

interface Phase {
    phaseNumber: number;
    title: string;
    description?: string;
    procedures: Procedure[];
    estimatedDuration?: number;
    status: 'pending' | 'in_progress' | 'completed';
}

interface TreatmentPlanBuilderProps {
    patientId: string;
    onSave: (plan: any) => void;
    initialData?: any;
}

export const TreatmentPlanBuilder: React.FC<TreatmentPlanBuilderProps> = ({ patientId, onSave, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [phases, setPhases] = useState<Phase[]>(
        initialData?.phases || [{ phaseNumber: 1, title: 'Fase 1', procedures: [], status: 'pending' }]
    );

    const addPhase = () => {
        setPhases([
            ...phases,
            {
                phaseNumber: phases.length + 1,
                title: `Fase ${phases.length + 1}`,
                procedures: [],
                status: 'pending'
            }
        ]);
    };

    const removePhase = (phaseNumber: number) => {
        if (phases.length === 1) return;
        setPhases(
            phases
                .filter(p => p.phaseNumber !== phaseNumber)
                .map((p, idx) => ({ ...p, phaseNumber: idx + 1, title: `Fase ${idx + 1}` }))
        );
    };

    const updatePhase = (phaseNumber: number, updates: Partial<Phase>) => {
        setPhases(phases.map(p => (p.phaseNumber === phaseNumber ? { ...p, ...updates } : p)));
    };

    const addProcedure = (phaseNumber: number, procedure: Procedure) => {
        setPhases(
            phases.map(p => (p.phaseNumber === phaseNumber ? { ...p, procedures: [...p.procedures, procedure] } : p))
        );
    };

    const removeProcedure = (phaseNumber: number, index: number) => {
        setPhases(
            phases.map(p =>
                p.phaseNumber === phaseNumber ? { ...p, procedures: p.procedures.filter((_, i) => i !== index) } : p
            )
        );
    };

    const handleSave = () => {
        const plan = {
            patient: patientId,
            title,
            description,
            phases,
            status: 'draft'
        };
        onSave(plan);
    };

    const totalCost = phases.reduce(
        (sum, phase) => sum + phase.procedures.reduce((pSum, proc) => pSum + proc.cost, 0),
        0
    );

    const totalInsurance = phases.reduce(
        (sum, phase) => sum + phase.procedures.reduce((pSum, proc) => pSum + (proc.insuranceCoverage || 0), 0),
        0
    );

    return (
        <div className="treatment-plan-builder">
            <div className="plan-header">
                <input
                    type="text"
                    className="plan-title"
                    placeholder="Título do Plano de Tratamento"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <textarea
                    className="plan-description"
                    placeholder="Descrição (opcional)"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={2}
                />
            </div>

            <div className="phases-container">
                {phases.map(phase => (
                    <PhaseManager
                        key={phase.phaseNumber}
                        phase={phase}
                        onUpdate={updates => updatePhase(phase.phaseNumber, updates)}
                        onRemove={() => removePhase(phase.phaseNumber)}
                        onAddProcedure={proc => addProcedure(phase.phaseNumber, proc)}
                        onRemoveProcedure={idx => removeProcedure(phase.phaseNumber, idx)}
                        canRemove={phases.length > 1}
                        patientId={patientId}
                    />
                ))}
            </div>

            <button className="add-phase-btn" onClick={addPhase}>
                + Adicionar Fase
            </button>

            <CostBreakdown
                totalCost={totalCost}
                totalInsurance={totalInsurance}
                totalPatient={totalCost - totalInsurance}
            />

            <div className="builder-actions">
                <button className="save-draft-btn" onClick={handleSave}>
                    Salvar Rascunho
                </button>
                <button
                    className="propose-btn"
                    onClick={() => {
                        const plan = { patient: patientId, title, description, phases, status: 'proposed' };
                        onSave(plan);
                    }}
                >
                    Propor ao Paciente
                </button>
            </div>
        </div>
    );
};
