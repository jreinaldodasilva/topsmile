// src/features/appointments/services/appointmentService.ts
import { BaseApiService } from '../../../services/base/BaseApiService';

interface Appointment {
    _id: string;
    patient: string;
    provider: string;
    clinic: string;
    appointmentType: string;
    scheduledStart: string;
    scheduledEnd: string;
    status: string;
    notes?: string;
}

interface CreateAppointmentData {
    patient: string;
    provider: string;
    appointmentType: string;
    scheduledStart: string;
    notes?: string;
    priority?: string;
}

interface GetAppointmentsParams {
    startDate: string;
    endDate: string;
    providerId?: string;
    status?: string;
}

class AppointmentService extends BaseApiService {
    private endpoint = '/api/appointments';

    async getAppointments(params: GetAppointmentsParams): Promise<{ success: boolean; data: Appointment[] }> {
        return this.get(this.endpoint, params);
    }

    async getById(id: string): Promise<{ success: boolean; data: Appointment }> {
        return this.get(`${this.endpoint}/${id}`);
    }

    async create(data: CreateAppointmentData): Promise<{ success: boolean; data: Appointment }> {
        return this.post(this.endpoint, data);
    }

    async update(id: string, data: Partial<Appointment>): Promise<{ success: boolean; data: Appointment }> {
        return this.patch(`${this.endpoint}/${id}`, data);
    }

    async updateStatus(
        id: string,
        status: string,
        cancellationReason?: string
    ): Promise<{ success: boolean; data: Appointment }> {
        return this.patch(`${this.endpoint}/${id}/status`, { status, cancellationReason });
    }

    async reschedule(
        id: string,
        newStart: string,
        reason: string,
        rescheduleBy: 'patient' | 'clinic'
    ): Promise<{ success: boolean; data: Appointment }> {
        return this.patch(`${this.endpoint}/${id}/reschedule`, { newStart, reason, rescheduleBy });
    }

    async deleteAppointment(id: string): Promise<{ success: boolean }> {
        return super.delete(`${this.endpoint}/${id}`);
    }

    async getProviderAvailability(
        providerId: string,
        date: string,
        appointmentTypeId: string
    ): Promise<{ success: boolean; data: any[] }> {
        return this.get(`${this.endpoint}/providers/${providerId}/availability`, { date, appointmentTypeId });
    }
}

export const appointmentService = new AppointmentService();
