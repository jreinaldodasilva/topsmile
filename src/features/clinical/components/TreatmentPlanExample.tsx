// src/features/clinical/components/TreatmentPlanExample.tsx
import React, { useEffect } from 'react';
import { useTreatmentPlan } from '../hooks';
import { useClinicalStore } from '../../../store';

interface TreatmentPlanExampleProps {
    patientId: string;
}

const TreatmentPlanExample: React.FC<TreatmentPlanExampleProps> = ({ patientId }) => {
    const { plans, loading, error, getByPatient, updatePhaseStatus } = useTreatmentPlan();
    const { activeTreatmentPlan, selectedPhase, setActiveTreatmentPlan, setSelectedPhase } = useClinicalStore();

    useEffect(() => {
        if (patientId) {
            getByPatient(patientId);
        }
    }, [patientId, getByPatient]);

    const handlePlanSelect = (plan: any) => {
        setActiveTreatmentPlan(plan);
        setSelectedPhase(null);
    };

    const handlePhaseClick = (phaseNumber: number) => {
        setSelectedPhase(phaseNumber);
    };

    const handlePhaseStatusUpdate = async (phaseNumber: number, status: string) => {
        if (activeTreatmentPlan) {
            try {
                await updatePhaseStatus(activeTreatmentPlan._id, phaseNumber, status);
            } catch (err) {
                console.error('Error updating phase:', err);
            }
        }
    };

    if (loading) return <div>Carregando planos de tratamento...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div className="treatment-plan">
            <div className="treatment-plan-list">
                <h3>Planos de Tratamento</h3>
                {plans.length === 0 ? (
                    <p>Nenhum plano encontrado</p>
                ) : (
                    plans.map((plan: any) => (
                        <div
                            key={plan._id}
                            className={`plan-item ${activeTreatmentPlan?._id === plan._id ? 'active' : ''}`}
                            onClick={() => handlePlanSelect(plan)}
                        >
                            <h4>{plan.title}</h4>
                            <span>Status: {plan.status}</span>
                        </div>
                    ))
                )}
            </div>

            {activeTreatmentPlan && (
                <div className="treatment-plan-details">
                    <h3>{activeTreatmentPlan.title}</h3>
                    <div className="phases">
                        {activeTreatmentPlan.phases?.map((phase: any, index: number) => (
                            <div
                                key={index}
                                className={`phase ${selectedPhase === index + 1 ? 'selected' : ''}`}
                                onClick={() => handlePhaseClick(index + 1)}
                            >
                                <h4>Fase {index + 1}</h4>
                                <p>Status: {phase.status}</p>
                                <button onClick={() => handlePhaseStatusUpdate(index + 1, 'completed')}>
                                    Marcar como Concluída
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreatmentPlanExample;
