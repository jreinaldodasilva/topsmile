// src/components/Clinical/TreatmentPlan/CostBreakdown.tsx
import React from 'react';
import './CostBreakdown.css';

interface CostBreakdownProps {
    totalCost: number;
    totalInsurance: number;
    totalPatient: number;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ totalCost, totalInsurance, totalPatient }) => {
    return (
        <div className="cost-breakdown">
            <h3>Resumo de Custos</h3>
            <div className="cost-row">
                <span>Custo Total:</span>
                <span className="cost-value">R$ {totalCost.toFixed(2)}</span>
            </div>
            <div className="cost-row insurance">
                <span>Cobertura do Seguro:</span>
                <span className="cost-value">- R$ {totalInsurance.toFixed(2)}</span>
            </div>
            <div className="cost-row patient">
                <span>Responsabilidade do Paciente:</span>
                <span className="cost-value total">R$ {totalPatient.toFixed(2)}</span>
            </div>
        </div>
    );
};
