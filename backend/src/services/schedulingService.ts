// backend/src/services/schedulingService.ts
import { Appointment, IAppointment } from '../models/Appointment';
import { Provider, IProvider } from '../models/Provider';
import { AppointmentType, IAppointmentType } from '../models/AppointmentType';
import { startOfDay, endOfDay, addMinutes, format, isWithinInterval, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';


export interface TimeSlot {
    start: Date;
    end: Date;
    available: boolean;
    providerId: string;
    appointmentTypeId?: string;
    conflictReason?: string;
}

export interface AvailabilityQuery {
    clinicId?: string;
    providerId?: string; // If not specified, check all providers
    appointmentTypeId: string;
    date: Date; // Target date
    excludeAppointmentId?: string; // For rescheduling
}

export interface CreateAppointmentData {
    clinicId: string;
    patientId: string;
    providerId: string;
    appointmentTypeId: string;
    scheduledStart: Date;
    notes?: string;
    priority?: 'routine' | 'urgent' | 'emergency';
    createdBy?: string;
}

class SchedulingService {
    
    /**
     * Get available time slots for a specific date and appointment type
     */
    async getAvailableSlots(query: AvailabilityQuery): Promise<TimeSlot[]> {
        const { clinicId, providerId, appointmentTypeId, date, excludeAppointmentId } = query;
        
        // Get appointment type details
        const appointmentType = await AppointmentType.findById(appointmentTypeId);
        if (!appointmentType) {
            throw new Error('Tipo de agendamento não encontrado');
        }

        // Get providers (specific one or all that can perform this service)
        const providerQuery: any = { clinic: clinicId, isActive: true };
        if (providerId) {
            providerQuery._id = providerId;
        } else {
            providerQuery.appointmentTypes = appointmentTypeId;
        }
        
        const providers = await Provider.find(providerQuery);
        if (providers.length === 0) {
            return [];
        }

        const slots: TimeSlot[] = [];
        const targetDate = startOfDay(date);

        for (const provider of providers) {
            const providerSlots = await this.getProviderAvailableSlots(
                provider,
                appointmentType,
                targetDate,
                excludeAppointmentId
            );
            slots.push(...providerSlots);
        }

        // Sort by start time
        return slots.sort((a, b) => a.start.getTime() - b.start.getTime());
    }

    /**
     * Get available slots for a specific provider on a specific date
     */
    private async getProviderAvailableSlots(
        provider: IProvider,
        appointmentType: IAppointmentType,
        date: Date,
        excludeAppointmentId?: string
    ): Promise<TimeSlot[]> {
        const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof provider.workingHours;
        const workingHours = provider.workingHours[dayOfWeek];

        // Provider doesn't work on this day
        if (!workingHours.isWorking || !workingHours.start || !workingHours.end) {
            return [];
        }

        // Convert working hours to Date objects
        const startTime = this.parseTimeToDate(date, workingHours.start, provider.timeZone);
        const endTime = this.parseTimeToDate(date, workingHours.end, provider.timeZone);

        // Get existing appointments for this provider on this date
        const existingAppointments = await this.getProviderAppointments(
            (provider._id as any).toString(),
            date,
            excludeAppointmentId
        );

        // Generate potential time slots
        const slots: TimeSlot[] = [];
        const slotInterval = 15; // 15-minute intervals
        const treatmentDuration = appointmentType.duration;
        
        // Buffer times (use appointment type override or provider default)
        const bufferBefore = appointmentType.bufferBefore || provider.bufferTimeBefore;
        const bufferAfter = appointmentType.bufferAfter || provider.bufferTimeAfter;
        const totalDuration = treatmentDuration + bufferBefore + bufferAfter;

        let currentTime = startTime;
        while (currentTime < endTime) {
            const slotEnd = addMinutes(currentTime, totalDuration);
            
            // Don't create slots that extend beyond working hours
            if (slotEnd > endTime) {
                break;
            }

            // Check if this slot conflicts with existing appointments
            const hasConflict = this.hasTimeConflict(
                currentTime,
                slotEnd,
                existingAppointments,
                bufferBefore,
                bufferAfter
            );

            slots.push({
                start: addMinutes(currentTime, bufferBefore), // Actual appointment start
                end: addMinutes(currentTime, bufferBefore + treatmentDuration), // Actual appointment end
                available: !hasConflict.conflict,
                providerId: (provider._id as any).toString(),
                appointmentTypeId: (appointmentType._id as any).toString(),
                conflictReason: hasConflict.reason
            });

            currentTime = addMinutes(currentTime, slotInterval);
        }

        return slots.filter(slot => slot.available); // Return only available slots
    }

    /**
     * Create a new appointment
     */
    async createAppointment(data: CreateAppointmentData): Promise<IAppointment> {
        const { clinicId, patientId, providerId, appointmentTypeId, scheduledStart, notes, priority, createdBy } = data;

        // Validate appointment type
        const appointmentType = await AppointmentType.findById(appointmentTypeId);
        if (!appointmentType) {
            throw new Error('Tipo de agendamento não encontrado');
        }

        // Validate provider
        const provider = await Provider.findById(providerId);
        if (!provider || !provider.isActive) {
            throw new Error('Profissional não encontrado ou inativo');
        }

        // Calculate end time
        const scheduledEnd = addMinutes(scheduledStart, appointmentType.duration);

        // Check availability
        const isAvailable = await this.isTimeSlotAvailable(
            providerId,
            scheduledStart,
            scheduledEnd,
            appointmentType
        );

        if (!isAvailable.available) {
            throw new Error(`Horário não disponível: ${isAvailable.reason}`);
        }

        // Create appointment
        const appointment = new Appointment({
            patient: patientId,
            clinic: clinicId,
            provider: providerId,
            appointmentType: appointmentTypeId,
            scheduledStart,
            scheduledEnd,
            status: appointmentType.requiresApproval ? 'scheduled' : 'confirmed',
            priority: priority || 'routine',
            notes,
            createdBy
        });

        return await appointment.save();
    }

    /**
     * Reschedule an existing appointment
     */
    async rescheduleAppointment(
        appointmentId: string,
        newStart: Date,
        reason: string,
        rescheduleBy: 'patient' | 'clinic'
    ): Promise<IAppointment> {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            throw new Error('Agendamento não encontrado');
        }

        const appointmentType = await AppointmentType.findById(appointment.appointmentType);
        if (!appointmentType) {
            throw new Error('Tipo de agendamento não encontrado');
        }

        const newEnd = addMinutes(newStart, appointmentType.duration);

        // Check availability (excluding current appointment)
        const isAvailable = await this.isTimeSlotAvailable(
            appointment.provider.toString(),
            newStart,
            newEnd,
            appointmentType,
            appointmentId
        );

        if (!isAvailable.available) {
            throw new Error(`Novo horário não disponível: ${isAvailable.reason}`);
        }

        // Add to reschedule history
        appointment.rescheduleHistory.push({
            oldDate: appointment.scheduledStart,
            newDate: newStart,
            reason,
            rescheduleBy,
            timestamp: new Date()
        });

        // Update appointment times
        appointment.scheduledStart = newStart;
        appointment.scheduledEnd = newEnd;
        appointment.status = 'scheduled'; // Reset to scheduled

        return await appointment.save();
    }

    /**
     * Cancel an appointment
     */
    async cancelAppointment(appointmentId: string, reason: string): Promise<IAppointment> {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            throw new Error('Agendamento não encontrado');
        }

        appointment.status = 'cancelled';
        appointment.cancellationReason = reason;

        return await appointment.save();
    }

    /**
     * Check if a specific time slot is available
     */
    private async isTimeSlotAvailable(
        providerId: string,
        start: Date,
        end: Date,
        appointmentType: IAppointmentType,
        excludeAppointmentId?: string
    ): Promise<{ available: boolean; reason?: string }> {
        // Get provider
        const provider = await Provider.findById(providerId);
        if (!provider) {
            return { available: false, reason: 'Profissional não encontrado' };
        }

        // Check working hours
        const dayOfWeek = format(start, 'EEEE').toLowerCase() as keyof typeof provider.workingHours;
        const workingHours = provider.workingHours[dayOfWeek];
        
        if (!workingHours.isWorking) {
            return { available: false, reason: 'Profissional não trabalha neste dia' };
        }

        const workStart = this.parseTimeToDate(start, workingHours.start, provider.timeZone);
        const workEnd = this.parseTimeToDate(start, workingHours.end, provider.timeZone);

        if (start < workStart || end > workEnd) {
            return { available: false, reason: 'Fora do horário de trabalho' };
        }

        // Get existing appointments
        const existingAppointments = await this.getProviderAppointments(
            providerId,
            start,
            excludeAppointmentId
        );

        // Check conflicts with buffer times
        const bufferBefore = appointmentType.bufferBefore || provider.bufferTimeBefore;
        const bufferAfter = appointmentType.bufferAfter || provider.bufferTimeAfter;
        
        const conflict = this.hasTimeConflict(
            addMinutes(start, -bufferBefore),
            addMinutes(end, bufferAfter),
            existingAppointments,
            0, // Buffer already applied
            0
        );

        return { available: !conflict.conflict, reason: conflict.reason };
    }

    /**
     * Get provider's appointments for a specific date
     */
    private async getProviderAppointments(
        providerId: string,
        date: Date,
        excludeAppointmentId?: string
    ): Promise<IAppointment[]> {
        const query: any = {
            provider: providerId,
            scheduledStart: {
                $gte: startOfDay(date),
                $lt: endOfDay(date)
            },
            status: { $nin: ['cancelled', 'no_show'] }
        };

        if (excludeAppointmentId) {
            query._id = { $ne: excludeAppointmentId };
        }

        return await Appointment.find(query).sort({ scheduledStart: 1 });
    }

    /**
     * Check if a time range conflicts with existing appointments
     */
    private hasTimeConflict(
        proposedStart: Date,
        proposedEnd: Date,
        existingAppointments: IAppointment[],
        bufferBefore: number,
        bufferAfter: number
    ): { conflict: boolean; reason?: string } {
        for (const appointment of existingAppointments) {
            const existingStart = addMinutes(appointment.scheduledStart, -bufferBefore);
            const existingEnd = addMinutes(appointment.scheduledEnd, bufferAfter);

            // Check if proposed time overlaps with existing appointment + buffers
            const hasOverlap = (
                (proposedStart >= existingStart && proposedStart < existingEnd) ||
                (proposedEnd > existingStart && proposedEnd <= existingEnd) ||
                (proposedStart <= existingStart && proposedEnd >= existingEnd)
            );

            if (hasOverlap) {
                return {
                    conflict: true,
                    reason: `Conflito com agendamento às ${format(appointment.scheduledStart, 'HH:mm')}`
                };
            }
        }

        return { conflict: false };
    }

    /**
     * Parse time string to Date object for a specific date
     */
private parseTimeToDate(date: Date, timeString: string, timeZone: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const targetDate = new Date(date);
    targetDate.setHours(hours, minutes, 0, 0);

    // This is the correct way to convert a local date/time to a UTC date,
    // considering the specified time zone.
    // We get a string that has a timezone offset.
    const dateInTimeZoneString = formatInTimeZone(targetDate, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");

    // The parseISO function correctly handles the timezone offset in the string
    // and returns a UTC date.
    return parseISO(dateInTimeZoneString);
}

    /**
     * Get appointments for a specific date range
     */
    async getAppointments(
        clinicId: string,
        startDate: Date,
        endDate: Date,
        providerId?: string,
        status?: string
    ): Promise<IAppointment[]> {
        const query: any = {
            clinic: clinicId,
            scheduledStart: {
                $gte: startDate,
                $lte: endDate
            }
        };

        if (providerId) {
            query.provider = providerId;
        }

        if (status) {
            query.status = status;
        }

        return await Appointment.find(query)
            .populate('patient', 'name phone email')
            .populate('provider', 'name specialties')
            .populate('appointmentType', 'name duration color category')
            .sort({ scheduledStart: 1 });
    }
}

export const schedulingService = new SchedulingService();