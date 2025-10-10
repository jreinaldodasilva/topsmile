// src/components/Clinical/TreatmentPlan/TreatmentPlanView.tsx
import React, { useState } from 'react';
import './TreatmentPlanView.css';

interface TreatmentPlanViewProps {
    plan: any;
    onAccept?: () => void;
    onUpdatePhase?: (phaseNumber: number, status: string) => void;
    isPatientView?: boolean;
}

export const TreatmentPlanView: React.FC<TreatmentPlanViewProps> = ({
    plan,
    onAccept,
    onUpdatePhase,
    isPatientView = false
}) => {
    const [presentationMode, setPresentationMode] = useState(false);

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { label: string; className: string }> = {
            draft: { label: 'Rascunho', className: 'status-draft' },
            proposed: { label: 'Proposto', className: 'status-proposed' },
            accepted: { label: 'Aceito', className: 'status-accepted' },
            in_progress: { label: 'Em Andamento', className: 'status-progress' },
            completed: { label: 'Concluído', className: 'status-completed' },
            cancelled: { label: 'Cancelado', className: 'status-cancelled' }
        };
        const badge = badges[status] || badges.draft;
        return <span className={`status-badge ${badge.className}`}>{badge.label}</span>;
    };

    const handlePrint = () => {
        window.print();
    };

    if (presentationMode) {
        return (
            <div className="treatment-plan-presentation">
                <button className="exit-presentation" onClick={() => setPresentationMode(false)}>
                    Sair da Apresentação
                </button>
                <div className="presentation-content">
                    <h1>{plan.title}</h1>
                    {plan.description && <p className="plan-desc">{plan.description}</p>}

                    {plan.phases.map((phase: any) => (
                        <div key={phase.phaseNumber} className="presentation-phase">
                            <h2>
                                Fase {phase.phaseNumber}: {phase.title}
                            </h2>
                            {phase.description && <p>{phase.description}</p>}

                            <div className="presentation-procedures">
                                {phase.procedures.map((proc: any, idx: number) => (
                                    <div key={idx} className="presentation-procedure">
                                        <h3>{proc.description}</h3>
                                        <p className="proc-cost">R$ {proc.cost.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="presentation-summary">
                        <h2>Resumo Financeiro</h2>
                        <p>
                            Total: <strong>R$ {plan.totalCost.toFixed(2)}</strong>
                        </p>
                        <p>
                            Cobertura do Seguro: <strong>R$ {plan.totalInsuranceCoverage.toFixed(2)}</strong>
                        </p>
                        <p>
                            Sua Responsabilidade: <strong>R$ {plan.totalPatientCost.toFixed(2)}</strong>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="treatment-plan-view">
            <div className="plan-header-view">
                <div>
                    <h2>{plan.title}</h2>
                    {getStatusBadge(plan.status)}
                </div>
                <div className="header-actions">
                    <button onClick={() => setPresentationMode(true)} className="present-btn">
                        Modo Apresentação
                    </button>
                    <button onClick={handlePrint} className="print-btn">
                        Imprimir
                    </button>
                </div>
            </div>

            {plan.description && <p className="plan-description-view">{plan.description}</p>}

            <div className="phases-view">
                {plan.phases.map((phase: any) => (
                    <div key={phase.phaseNumber} className="phase-view">
                        <div className="phase-header-view">
                            <h3>
                                Fase {phase.phaseNumber}: {phase.title}
                            </h3>
                            {getStatusBadge(phase.status)}
                        </div>

                        {phase.description && <p className="phase-desc">{phase.description}</p>}

                        <table className="procedures-table-view">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Procedimento</th>
                                    <th>Dente</th>
                                    <th>Custo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {phase.procedures.map((proc: any, idx: number) => (
                                    <tr key={idx}>
                                        <td>{proc.code}</td>
                                        <td>{proc.description}</td>
                                        <td>{proc.tooth || '-'}</td>
                                        <td>R$ {proc.cost.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {!isPatientView && onUpdatePhase && phase.status !== 'completed' && (
                            <div className="phase-actions">
                                {phase.status === 'pending' && (
                                    <button
                                        onClick={() => onUpdatePhase(phase.phaseNumber, 'in_progress')}
                                        className="start-phase-btn"
                                    >
                                        Iniciar Fase
                                    </button>
                                )}
                                {phase.status === 'in_progress' && (
                                    <button
                                        onClick={() => onUpdatePhase(phase.phaseNumber, 'completed')}
                                        className="complete-phase-btn"
                                    >
                                        Concluir Fase
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="cost-summary-view">
                <h3>Resumo Financeiro</h3>
                <div className="summary-row">
                    <span>Custo Total:</span>
                    <span>R$ {plan.totalCost.toFixed(2)}</span>
                </div>
                <div className="summary-row insurance">
                    <span>Cobertura do Seguro:</span>
                    <span>- R$ {plan.totalInsuranceCoverage.toFixed(2)}</span>
                </div>
                <div className="summary-row patient">
                    <span>Sua Responsabilidade:</span>
                    <span>R$ {plan.totalPatientCost.toFixed(2)}</span>
                </div>
            </div>

            {isPatientView && plan.status === 'proposed' && onAccept && (
                <div className="accept-section">
                    <button onClick={onAccept} className="accept-btn">
                        Aceitar Plano de Tratamento
                    </button>
                </div>
            )}
        </div>
    );
};
