// backend/src/services/bookingService.ts
import { Appointment } from '../models/Appointment';
import { Provider } from '../models/Provider';
import { AppointmentType } from '../models/AppointmentType';
import mongoose from 'mongoose';

interface AvailabilitySlot {
    start: Date;
    end: Date;
    providerId: string;
    providerName: string;
    providerPhoto?: string;
}

class BookingService {
    async getAvailableSlots(
        clinicId: string,
        appointmentTypeId: string,
        date: Date,
        providerPreference?: string
    ): Promise<AvailabilitySlot[]> {
        const appointmentType = await AppointmentType.findById(appointmentTypeId);
        if (!appointmentType) throw new Error('Tipo de agendamento não encontrado');

        const duration = appointmentType.duration || 30;
        const startOfDay = new Date(date);
        startOfDay.setHours(8, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(18, 0, 0, 0);

        const providerQuery: any = { clinic: clinicId, isActive: true };
        if (providerPreference) providerQuery._id = providerPreference;
        if (appointmentType.appointmentTypes?.length) {
            providerQuery.appointmentTypes = { $in: [appointmentTypeId] };
        }

        const providers = await Provider.find(providerQuery).lean();
        const slots: AvailabilitySlot[] = [];

        for (const provider of providers) {
            const existingAppointments = await Appointment.find({
                provider: provider._id,
                scheduledStart: { $gte: startOfDay, $lt: endOfDay },
                status: { $nin: ['cancelled', 'no_show'] }
            }).lean();

            let currentTime = new Date(startOfDay);
            while (currentTime < endOfDay) {
                const slotEnd = new Date(currentTime.getTime() + duration * 60000);
                
                const hasConflict = existingAppointments.some(apt => {
                    const aptStart = new Date(apt.scheduledStart);
                    const aptEnd = new Date(apt.scheduledEnd);
                    return (currentTime < aptEnd && slotEnd > aptStart);
                });

                if (!hasConflict) {
                    slots.push({
                        start: new Date(currentTime),
                        end: slotEnd,
                        providerId: provider._id.toString(),
                        providerName: provider.name,
                        providerPhoto: provider.photoUrl
                    });
                }

                currentTime = new Date(currentTime.getTime() + 30 * 60000);
            }
        }

        return slots.sort((a, b) => a.start.getTime() - b.start.getTime());
    }

    async createBooking(data: {
        patientId: string;
        clinicId: string;
        providerId: string;
        appointmentTypeId: string;
        scheduledStart: Date;
        notes?: string;
    }) {
        const appointmentType = await AppointmentType.findById(data.appointmentTypeId);
        if (!appointmentType) throw new Error('Tipo de agendamento não encontrado');

        const duration = appointmentType.duration || 30;
        const scheduledEnd = new Date(data.scheduledStart.getTime() + duration * 60000);

        const conflicts = await Appointment.find({
            provider: data.providerId,
            $or: [
                { scheduledStart: { $lt: scheduledEnd, $gte: data.scheduledStart } },
                { scheduledEnd: { $gt: data.scheduledStart, $lte: scheduledEnd } }
            ],
            status: { $nin: ['cancelled', 'no_show'] }
        });

        if (conflicts.length > 0) {
            throw new Error('Horário não disponível');
        }

        const appointment = new Appointment({
            patient: data.patientId,
            clinic: data.clinicId,
            provider: data.providerId,
            appointmentType: data.appointmentTypeId,
            scheduledStart: data.scheduledStart,
            scheduledEnd,
            status: 'scheduled',
            notes: data.notes,
            createdBy: data.patientId
        });

        await appointment.save();
        return appointment;
    }
}

export const bookingService = new BookingService();
