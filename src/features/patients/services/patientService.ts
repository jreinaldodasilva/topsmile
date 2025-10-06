// src/features/patients/services/patientService.ts
import { BaseApiService } from '../../../services/base/BaseApiService';

interface Patient {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    dateOfBirth?: string;
    cpf?: string;
    status: 'active' | 'inactive';
    clinic: string;
}

interface CreatePatientData {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    dateOfBirth?: string;
    cpf?: string;
    address?: any;
    emergencyContact?: any;
    medicalHistory?: any;
}

interface SearchPatientsParams {
    search?: string;
    status?: 'active' | 'inactive';
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

class PatientService extends BaseApiService {
    private endpoint = '/api/patients';

    async search(params: SearchPatientsParams): Promise<{ success: boolean; data: any }> {
        return this.get(this.endpoint, params);
    }

    async getById(id: string): Promise<{ success: boolean; data: Patient }> {
        return this.get(`${this.endpoint}/${id}`);
    }

    async create(data: CreatePatientData): Promise<{ success: boolean; data: Patient }> {
        return this.post(this.endpoint, data);
    }

    async update(id: string, data: Partial<Patient>): Promise<{ success: boolean; data: Patient }> {
        return this.patch(`${this.endpoint}/${id}`, data);
    }

    async updateMedicalHistory(id: string, medicalHistory: any): Promise<{ success: boolean; data: Patient }> {
        return this.patch(`${this.endpoint}/${id}/medical-history`, medicalHistory);
    }

    async deletePatient(id: string): Promise<{ success: boolean }> {
        return super.delete(`${this.endpoint}/${id}`);
    }

    async reactivate(id: string): Promise<{ success: boolean; data: Patient }> {
        return this.patch(`${this.endpoint}/${id}/reactivate`, {});
    }

    async getStats(): Promise<{ success: boolean; data: any }> {
        return this.get(`${this.endpoint}/stats`);
    }
}

export const patientService = new PatientService();
