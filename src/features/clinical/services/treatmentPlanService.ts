// src/features/clinical/services/treatmentPlanService.ts
import { BaseApiService } from '../../../services/base/BaseApiService';

interface TreatmentPlan {
    _id: string;
    patient: string;
    provider: string;
    clinic: string;
    title: string;
    phases: any[];
    status: string;
}

interface CreateTreatmentPlanData {
    patient: string;
    provider: string;
    title: string;
    phases: any[];
}

class TreatmentPlanService extends BaseApiService {
    private endpoint = '/api/treatment-plans';

    async getByPatient(patientId: string): Promise<{ success: boolean; data: TreatmentPlan[] }> {
        return this.get(`${this.endpoint}/patient/${patientId}`);
    }

    async getById(id: string): Promise<{ success: boolean; data: TreatmentPlan }> {
        return this.get(`${this.endpoint}/${id}`);
    }

    async create(data: CreateTreatmentPlanData): Promise<{ success: boolean; data: TreatmentPlan }> {
        return this.post(this.endpoint, data);
    }

    async update(id: string, data: Partial<TreatmentPlan>): Promise<{ success: boolean; data: TreatmentPlan }> {
        return this.put(`${this.endpoint}/${id}`, data);
    }

    async accept(id: string, acceptedBy: string): Promise<{ success: boolean; data: TreatmentPlan }> {
        return this.patch(`${this.endpoint}/${id}/accept`, { acceptedBy });
    }

    async updatePhaseStatus(
        id: string,
        phaseNumber: number,
        status: string
    ): Promise<{ success: boolean; data: TreatmentPlan }> {
        return this.patch(`${this.endpoint}/${id}/phase/${phaseNumber}`, { status });
    }
}

export const treatmentPlanService = new TreatmentPlanService();
