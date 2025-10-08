// backend/src/services/treatmentPlanService.ts
import { getCDTCodeByCode } from '../../config/clinical/cdtCodes';
import { BaseService } from '../base/BaseService';
import { NotFoundError } from '../../utils/errors/errors';
import type { TreatmentPlan as ITreatmentPlan, Insurance as IInsurance } from '@topsmile/types';
import { Insurance } from '../../models/Insurance';
import { TreatmentPlan } from '../../models/TreatmentPlan';

export interface InsuranceEstimate {
    procedureCode: string;
    cost: number;
    estimatedCoverage: number;
    patientResponsibility: number;
    coveragePercentage: number;
}

class TreatmentPlanService extends BaseService<any> {
    constructor() {
        super(TreatmentPlan as any);
    }
    async estimateInsuranceCoverage(
        patientId: string,
        procedures: Array<{ code: string; cost: number; tooth?: string }>
    ): Promise<InsuranceEstimate[]> {
        const insurance = await Insurance.findOne({
            patient: patientId,
            status: 'active'
        }).lean();

        if (!insurance) {
            return procedures.map(proc => ({
                procedureCode: proc.code,
                cost: proc.cost,
                estimatedCoverage: 0,
                patientResponsibility: proc.cost,
                coveragePercentage: 0
            }));
        }

        return procedures.map(proc => {
            const cdtCode = getCDTCodeByCode(proc.code);
            let coveragePercentage = 0;

            if (cdtCode) {
                if (cdtCode.category === 'Preventivo') {
                    coveragePercentage = (insurance.coverageDetails as any)?.preventive || 0;
                } else if (cdtCode.category === 'Restaurador') {
                    coveragePercentage = (insurance.coverageDetails as any)?.basic || 0;
                } else if (['Prótese', 'Ortodontia'].includes(cdtCode.category)) {
                    coveragePercentage = (insurance.coverageDetails as any)?.major || 0;
                }
            }

            const estimatedCoverage = (proc.cost * coveragePercentage) / 100;
            const patientResponsibility = proc.cost - estimatedCoverage;

            return {
                procedureCode: proc.code,
                cost: proc.cost,
                estimatedCoverage,
                patientResponsibility,
                coveragePercentage
            };
        });
    }

    async acceptTreatmentPlan(
        planId: string,
        acceptedBy: string
    ): Promise<ITreatmentPlan | null> {
        const plan = await TreatmentPlan.findByIdAndUpdate(
            planId,
            {
                status: 'accepted',
                acceptedAt: new Date(),
                acceptedBy
            },
            { new: true }
        );

        return plan as any;
    }

    async updatePhaseStatus(
        planId: string,
        phaseNumber: number,
        status: 'pending' | 'in_progress' | 'completed'
    ): Promise<ITreatmentPlan | null> {
        const plan = await TreatmentPlan.findById(planId);
        if (!plan) return null;

        const phase = plan.phases.find(p => p.phaseNumber === phaseNumber);
        if (!phase) return null;

        phase.status = status;
        if (status === 'in_progress' && !phase.startDate) {
            phase.startDate = new Date();
        }
        if (status === 'completed') {
            phase.completedDate = new Date();
        }

        const allCompleted = plan.phases.every(p => p.status === 'completed');
        if (allCompleted) {
            plan.status = 'completed';
        } else if (plan.status === 'accepted') {
            plan.status = 'in_progress';
        }

        await plan.save();
        return plan as any;
    }
}

export const treatmentPlanService = new TreatmentPlanService();
