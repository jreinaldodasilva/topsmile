// backend/src/services/appointmentService.ts
import { Appointment as IAppointment } from '@topsmile/types';
import { Appointment as AppointmentModel } from '../models/Appointment';
import { BaseService } from './base/BaseService';
import { ValidationError, ConflictError } from '../utils/errors';
import mongoose from 'mongoose';

export interface CreateAppointmentData {
  patient: string;
  provider: string;
  appointmentType: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  notes?: string;
  priority?: 'routine' | 'urgent' | 'emergency';
  remindersSent?: {
    confirmation?: boolean;
    reminder24h?: boolean;
    reminder2h?: boolean;
  };
  clinic: string;
  createdBy: string;
}

export interface UpdateAppointmentData {
  scheduledStart?: Date;
  scheduledEnd?: Date;
  notes?: string;
  status?: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  cancellationReason?: string;
  rescheduleHistory?: Array<{
    oldDate: Date;
    newDate: Date;
    reason: string;
    rescheduleBy: 'patient' | 'clinic';
    timestamp: Date;
  }>;
}

export interface AppointmentFilters {
  status?: string | string[];
  startDate?: Date;
  endDate?: Date;
  providerId?: string;
  patientId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class AppointmentService extends BaseService<IAppointment> {
  constructor() {
    super(AppointmentModel);
  }

  async createAppointment(data: CreateAppointmentData): Promise<IAppointment> {
    if (!data.patient || !data.provider || !data.appointmentType || !data.scheduledStart || !data.scheduledEnd || !data.clinic) {
      throw new ValidationError('Todos os campos obrigatórios devem ser preenchidos');
    }

    if (new Date(data.scheduledStart) < new Date()) {
      throw new ValidationError('Não é possível agendar no passado');
    }

    if (!mongoose.Types.ObjectId.isValid(data.clinic)) {
      throw new ValidationError('ID da clínica inválido');
    }

    const overlapping = await AppointmentModel.findOne({
      provider: data.provider,
      clinic: data.clinic,
      status: { $in: ['scheduled', 'confirmed', 'in_progress'] },
      $or: [
        { scheduledStart: { $lt: data.scheduledEnd, $gte: data.scheduledStart } },
        { scheduledEnd: { $gt: data.scheduledStart, $lte: data.scheduledEnd } },
        { scheduledStart: { $lte: data.scheduledStart }, scheduledEnd: { $gte: data.scheduledEnd } }
      ]
    });

    if (overlapping) {
      throw new ConflictError('Horário indisponível');
    }

    const appointment = new AppointmentModel({
      ...data,
      status: 'scheduled',
      remindersSent: data.remindersSent || {}
    });

    return await appointment.save();
  }

  async getAppointmentById(appointmentId: string, clinicId: string): Promise<IAppointment | null> {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      throw new ValidationError('ID do agendamento inválido');
    }

    return await AppointmentModel.findOne({
      _id: appointmentId,
      clinic: clinicId
    }).populate('patient provider appointmentType');
  }

  async getAppointments(clinicId: string, filters: AppointmentFilters = {}): Promise<IAppointment[]> {
    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
      throw new ValidationError('ID da clínica inválido');
    }

    const query: any = { clinic: clinicId };

    if (filters.status) query.status = filters.status;
    if (filters.startDate && filters.endDate) {
      query.scheduledStart = { $gte: filters.startDate };
      query.scheduledEnd = { $lte: filters.endDate };
    }
    if (filters.providerId) query.provider = filters.providerId;

    return await AppointmentModel.find(query)
      .populate('patient provider appointmentType')
      .sort({ scheduledStart: 1 });
  }

  async updateAppointment(appointmentId: string, clinicId: string, data: UpdateAppointmentData): Promise<IAppointment | null> {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      throw new ValidationError('ID do agendamento inválido');
    }

    const appointment = await AppointmentModel.findOne({ _id: appointmentId, clinic: clinicId });
    if (!appointment) return null;

    if (appointment.status === 'cancelled') {
      throw new ValidationError('Não é possível alterar um agendamento cancelado');
    }

    if (data.scheduledStart && data.scheduledEnd) {
      const overlapping = await AppointmentModel.findOne({
        provider: appointment.provider,
        clinic: clinicId,
        status: { $in: ['scheduled', 'confirmed', 'in_progress'] },
        _id: { $ne: appointmentId },
        $or: [
          { scheduledStart: { $lt: data.scheduledEnd, $gte: data.scheduledStart } },
          { scheduledEnd: { $gt: data.scheduledStart, $lte: data.scheduledEnd } },
          { scheduledStart: { $lte: data.scheduledStart }, scheduledEnd: { $gte: data.scheduledEnd } }
        ]
      });

      if (overlapping) {
        throw new ConflictError('Horário indisponível');
      }

      if (!appointment.rescheduleHistory) appointment.rescheduleHistory = [];
      appointment.rescheduleHistory.push({
        oldDate: appointment.scheduledStart as Date,
        newDate: data.scheduledStart,
        reason: data.rescheduleHistory?.[0]?.reason || 'Reagendamento',
        rescheduleBy: 'clinic',
        timestamp: new Date(),
        rescheduleCount: appointment.rescheduleHistory.length + 1
      });

      appointment.scheduledStart = data.scheduledStart;
      appointment.scheduledEnd = data.scheduledEnd;
    }

    if (data.notes !== undefined) appointment.notes = data.notes;
    if (data.status !== undefined) appointment.status = data.status;
    if (data.cancellationReason !== undefined) appointment.cancellationReason = data.cancellationReason;

    return await appointment.save();
  }

  async cancelAppointment(appointmentId: string, clinicId: string, reason: string): Promise<IAppointment | null> {
    return await this.updateAppointment(appointmentId, clinicId, {
      status: 'cancelled',
      cancellationReason: reason
    });
  }

  async checkAvailability(providerId: string, startDate: Date, endDate: Date, clinicId: string): Promise<boolean> {
    const overlapping = await AppointmentModel.findOne({
      provider: providerId,
      clinic: clinicId,
      status: { $in: ['scheduled', 'confirmed', 'in_progress'] },
      $or: [
        { scheduledStart: { $lt: endDate, $gte: startDate } },
        { scheduledEnd: { $gt: startDate, $lte: endDate } },
        { scheduledStart: { $lte: startDate }, scheduledEnd: { $gte: endDate } }
      ]
    });

    return !overlapping;
  }

  async getAppointmentStats(clinicId: string, startDate?: Date, endDate?: Date): Promise<{
    total: number;
    scheduled: number;
    confirmed: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  }> {
    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
      throw new ValidationError('ID da clínica inválido');
    }

    const query: any = { clinic: clinicId };
    if (startDate && endDate) {
      query.scheduledStart = { $gte: startDate };
      query.scheduledEnd = { $lte: endDate };
    }

    const [total, scheduled, confirmed, inProgress, completed, cancelled] = await Promise.all([
      AppointmentModel.countDocuments(query),
      AppointmentModel.countDocuments({ ...query, status: 'scheduled' }),
      AppointmentModel.countDocuments({ ...query, status: 'confirmed' }),
      AppointmentModel.countDocuments({ ...query, status: 'in-progress' }),
      AppointmentModel.countDocuments({ ...query, status: 'completed' }),
      AppointmentModel.countDocuments({ ...query, status: 'cancelled' })
    ]);

    return { total, scheduled, confirmed, inProgress, completed, cancelled };
  }

  async rescheduleAppointment(
    appointmentId: string,
    clinicId: string,
    newStart: Date,
    newEnd: Date,
    reason: string
  ): Promise<IAppointment | null> {
    const appointment = await AppointmentModel.findOne({ _id: appointmentId, clinic: clinicId });
    if (!appointment) return null;

    const overlapping = await AppointmentModel.findOne({
      provider: appointment.provider,
      clinic: clinicId,
      status: { $in: ['scheduled', 'confirmed', 'in_progress'] },
      _id: { $ne: appointmentId },
      $or: [
        { scheduledStart: { $lt: newEnd, $gte: newStart } },
        { scheduledEnd: { $gt: newStart, $lte: newEnd } },
        { scheduledStart: { $lte: newStart }, scheduledEnd: { $gte: newEnd } }
      ]
    });

    if (overlapping) {
      throw new ConflictError('Horário indisponível');
    }

    if (!appointment.rescheduleHistory) appointment.rescheduleHistory = [];
    appointment.rescheduleHistory.push({
      oldDate: appointment.scheduledStart as Date,
      newDate: newStart,
      reason,
      rescheduleBy: 'clinic',
      timestamp: new Date(),
      rescheduleCount: appointment.rescheduleHistory.length + 1
    });

    appointment.scheduledStart = newStart;
    appointment.scheduledEnd = newEnd;

    return await appointment.save();
  }
}

export const appointmentService = new AppointmentService();
