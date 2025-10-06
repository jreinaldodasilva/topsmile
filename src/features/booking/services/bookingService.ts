// src/features/booking/services/bookingService.ts
import { BaseApiService } from '../../../services/base/BaseApiService';

class BookingService extends BaseApiService {
    private endpoint = '/api/booking';

    async getAppointmentTypes(clinicId: string): Promise<{ success: boolean; data: any[] }> {
        return this.get(`${this.endpoint}/appointment-types`, { clinicId });
    }

    async getAvailableSlots(params: {
        clinicId: string;
        appointmentTypeId: string;
        date: string;
        providerId?: string;
    }): Promise<{ success: boolean; data: any[] }> {
        return this.get(`${this.endpoint}/available-slots`, params);
    }

    async createBooking(data: any): Promise<{ success: boolean; data: any }> {
        return this.post(this.endpoint, data);
    }
}

export const bookingService = new BookingService();
