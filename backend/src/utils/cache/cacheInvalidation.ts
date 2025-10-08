// backend/src/utils/cacheInvalidation.ts
import { cacheService, CacheKeys } from './cache';

export class CacheInvalidator {
    // Invalidate all provider-related caches
    static async invalidateProvider(providerId: string): Promise<void> {
        await Promise.all([
            cacheService.del(CacheKeys.provider(providerId)),
            cacheService.delPattern(`provider:${providerId}:*`)
        ]);
    }

    // Invalidate provider availability cache
    static async invalidateProviderAvailability(providerId: string, date?: string): Promise<void> {
        if (date) {
            await cacheService.del(CacheKeys.providerAvailability(providerId, date));
        } else {
            await cacheService.delPattern(`provider:${providerId}:availability:*`);
        }
    }

    // Invalidate appointment type caches
    static async invalidateAppointmentType(appointmentTypeId: string, clinicId?: string): Promise<void> {
        const promises = [cacheService.del(CacheKeys.appointmentType(appointmentTypeId))];
        
        if (clinicId) {
            promises.push(cacheService.del(CacheKeys.appointmentTypes(clinicId)));
        }
        
        await Promise.all(promises);
    }

    // Invalidate all appointment types for a clinic
    static async invalidateAppointmentTypes(clinicId: string): Promise<void> {
        await cacheService.del(CacheKeys.appointmentTypes(clinicId));
    }

    // Invalidate patient cache
    static async invalidatePatient(patientId: string): Promise<void> {
        await cacheService.del(CacheKeys.patient(patientId));
    }

    // Invalidate appointments cache
    static async invalidateAppointments(clinicId: string): Promise<void> {
        await cacheService.delPattern(`appointments:${clinicId}:*`);
    }

    // Invalidate clinic stats
    static async invalidateClinicStats(clinicId: string): Promise<void> {
        await cacheService.del(CacheKeys.clinicStats(clinicId));
    }

    // Invalidate all caches related to an appointment change
    static async invalidateAppointmentRelated(
        clinicId: string,
        providerId: string,
        date: Date
    ): Promise<void> {
        const dateStr = date.toISOString().split('T')[0];
        
        await Promise.all([
            this.invalidateAppointments(clinicId),
            this.invalidateProviderAvailability(providerId, dateStr),
            this.invalidateClinicStats(clinicId)
        ]);
    }

    // Invalidate all caches for a clinic
    static async invalidateClinic(clinicId: string): Promise<void> {
        await Promise.all([
            cacheService.delPattern(`*:${clinicId}:*`),
            cacheService.delPattern(`clinic:${clinicId}:*`)
        ]);
    }
}
