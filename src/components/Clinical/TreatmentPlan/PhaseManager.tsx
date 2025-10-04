// src/components/Clinical/TreatmentPlan/PhaseManager.tsx
import React, { useState } from 'react';
import { ProcedureSelector } from './ProcedureSelector';
import './PhaseManager.css';

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

interface PhaseManagerProps {
  phase: Phase;
  onUpdate: (updates: Partial<Phase>) => void;
  onRemove: () => void;
  onAddProcedure: (procedure: Procedure) => void;
  onRemoveProcedure: (index: number) => void;
  canRemove: boolean;
  patientId: string;
}

export const PhaseManager: React.FC<PhaseManagerProps> = ({
  phase,
  onUpdate,
  onRemove,
  onAddProcedure,
  onRemoveProcedure,
  canRemove,
  patientId
}) => {
  const [showSelector, setShowSelector] = useState(false);

  const phaseCost = phase.procedures.reduce((sum, proc) => sum + proc.cost, 0);

  return (
    <div className="phase-manager">
      <div className="phase-header">
        <input
          type="text"
          value={phase.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="phase-title"
        />
        {canRemove && (
          <button onClick={onRemove} className="remove-phase-btn">×</button>
        )}
      </div>

      <textarea
        placeholder="Descrição da fase (opcional)"
        value={phase.description || ''}
        onChange={(e) => onUpdate({ description: e.target.value })}
        className="phase-description"
        rows={2}
      />

      <div className="phase-procedures">
        {phase.procedures.length === 0 ? (
          <p className="no-procedures">Nenhum procedimento adicionado</p>
        ) : (
          <table className="procedures-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Dente</th>
                <th>Custo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {phase.procedures.map((proc, idx) => (
                <tr key={idx}>
                  <td>{proc.code}</td>
                  <td>{proc.description}</td>
                  <td>{proc.tooth || '-'}</td>
                  <td>R$ {proc.cost.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => onRemoveProcedure(idx)}
                      className="remove-proc-btn"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showSelector ? (
        <div className="selector-container">
          <ProcedureSelector
            onSelect={(proc) => {
              onAddProcedure(proc);
              setShowSelector(false);
            }}
            patientId={patientId}
          />
          <button
            onClick={() => setShowSelector(false)}
            className="cancel-selector-btn"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowSelector(true)}
          className="add-procedure-btn"
        >
          + Adicionar Procedimento
        </button>
      )}

      <div className="phase-footer">
        <span className="phase-cost">Total da Fase: R$ {phaseCost.toFixed(2)}</span>
      </div>
    </div>
  );
};
