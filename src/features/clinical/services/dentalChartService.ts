// src/features/clinical/services/dentalChartService.ts
import { BaseApiService } from '../../../services/base/BaseApiService';

interface DentalChart {
    _id: string;
    patient: string;
    provider: string;
    clinic: string;
    numberingSystem: 'fdi' | 'universal';
    teeth: any[];
    chartDate: string;
    notes?: string;
}

interface CreateDentalChartData {
    patient: string;
    provider: string;
    numberingSystem: 'fdi' | 'universal';
    teeth?: any[];
    notes?: string;
}

class DentalChartService extends BaseApiService {
    private endpoint = '/api/dental-charts';

    async getByPatient(patientId: string): Promise<{ success: boolean; data: DentalChart[] }> {
        return this.get(`${this.endpoint}/patient/${patientId}`);
    }

    async getLatest(patientId: string): Promise<{ success: boolean; data: DentalChart }> {
        return this.get(`${this.endpoint}/patient/${patientId}/latest`);
    }

    async getById(id: string): Promise<{ success: boolean; data: DentalChart }> {
        return this.get(`${this.endpoint}/${id}`);
    }

    async create(data: CreateDentalChartData): Promise<{ success: boolean; data: DentalChart }> {
        return this.post(this.endpoint, data);
    }

    async update(id: string, data: Partial<DentalChart>): Promise<{ success: boolean; data: DentalChart }> {
        return this.put(`${this.endpoint}/${id}`, data);
    }
}

export const dentalChartService = new DentalChartService();
