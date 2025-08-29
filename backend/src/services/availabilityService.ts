// backend/src/services/availabilityService.ts
import { Provider } from '../models/Provider';
import { Appointment } from '../models/Appointment';
import { AppointmentType } from '../models/AppointmentType';
import { addMinutes, format, startOfDay, endOfDay } from 'date-fns';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';

export interface AvailabilitySlot {
  start: Date;
  end: Date;
  available: boolean;
  providerId: string;
  conflictReason?: string;
}

export interface GenerateAvailabilityOptions {
  providerId: string;
  appointmentTypeId: string;
  fromIso: string;
  toIso: string;
  granularityMin?: number;
}

/**
 * Generate availability slots for a provider and appointment type
 */
export async function generateAvailability(options: GenerateAvailabilityOptions): Promise<AvailabilitySlot[]> {
  const { providerId, appointmentTypeId, fromIso, toIso, granularityMin = 15 } = options;

  // Validate inputs
  const fromDate = new Date(fromIso);
  const toDate = new Date(toIso);
  
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    throw new Error('Invalid date format');
  }

  // Get provider and appointment type
  const [provider, appointmentType] = await Promise.all([
    Provider.findById(providerId),
    AppointmentType.findById(appointmentTypeId)
  ]);

  if (!provider) {
    throw new Error('Provider not found');
  }

  if (!appointmentType) {
    throw new Error('Appointment type not found');
  }

  if (!provider.isActive) {
    throw new Error('Provider is not active');
  }

  const slots: AvailabilitySlot[] = [];
  
  // Process each day in the range
  let currentDay = startOfDay(fromDate);
  const lastDay = startOfDay(toDate);

  while (currentDay <= lastDay) {
    const daySlots = await generateDayAvailability({
      provider,
      appointmentType,
      date: currentDay,
      granularityMin,
      startTime: currentDay.getTime() === fromDate.getTime() ? fromDate : undefined,
      endTime: currentDay.getTime() === lastDay.getTime() ? toDate : undefined
    });
    
    slots.push(...daySlots);
    currentDay = addMinutes(currentDay, 24 * 60); // Next day
  }

  return slots;
}

interface GenerateDayAvailabilityOptions {
  provider: any;
  appointmentType: any;
  date: Date;
  granularityMin: number;
  startTime?: Date;
  endTime?: Date;
}

async function generateDayAvailability(options: GenerateDayAvailabilityOptions): Promise<AvailabilitySlot[]> {
  const { provider, appointmentType, date, granularityMin, startTime, endTime } = options;
  
  // Get day of week (lowercase)
  const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof provider.workingHours;
  const workingHours = provider.workingHours[dayOfWeek];

  // Check if provider works on this day
  if (!workingHours || !workingHours.isWorking) {
    return [];
  }

  // Parse working hours to Date objects
  const workStart = parseTimeToDate(date, workingHours.start, provider.timeZone);
  const workEnd = parseTimeToDate(date, workingHours.end, provider.timeZone);

  // Apply time range filters
  const rangeStart = startTime && startTime > workStart ? startTime : workStart;
  const rangeEnd = endTime && endTime < workEnd ? endTime : workEnd;

  if (rangeStart >= rangeEnd) {
    return [];
  }

  // Get existing appointments for this day
  const existingAppointments = await Appointment.find({
    provider: provider._id,
    scheduledStart: {
      $gte: startOfDay(date),
      $lt: endOfDay(date)
    },
    status: { $nin: ['cancelled', 'no_show'] }
  }).sort({ scheduledStart: 1 });

  // Generate time slots
  const slots: AvailabilitySlot[] = [];
  const treatmentDuration = appointmentType.duration;
  const bufferBefore = appointmentType.bufferBefore || provider.bufferTimeBefore || 0;
  const bufferAfter = appointmentType.bufferAfter || provider.bufferTimeAfter || 0;

  let currentTime = rangeStart;

  while (currentTime < rangeEnd) {
    const slotEnd = addMinutes(currentTime, treatmentDuration);
    
    // Don't create slots that extend beyond working hours
    if (slotEnd > rangeEnd) {
      break;
    }

    // Check for conflicts with existing appointments
    const hasConflict = checkTimeConflict(
      currentTime,
      slotEnd,
      existingAppointments,
      bufferBefore,
      bufferAfter
    );

    slots.push({
      start: currentTime,
      end: slotEnd,
      available: !hasConflict.hasConflict,
      providerId: provider._id.toString(),
      conflictReason: hasConflict.reason
    });

    currentTime = addMinutes(currentTime, granularityMin);
  }

  // Return only available slots
  return slots.filter(slot => slot.available);
}

function parseTimeToDate(date: Date, timeString: string, timeZone: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Create date in the provider's timezone
  const dateStr = format(date, 'yyyy-MM-dd');
  const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  const dateTimeStr = `${dateStr}T${timeStr}`;
  
  // Convert from provider's timezone to UTC
  return zonedTimeToUtc(dateTimeStr, timeZone);
}

function checkTimeConflict(
  proposedStart: Date,
  proposedEnd: Date,
  existingAppointments: any[],
  bufferBefore: number,
  bufferAfter: number
): { hasConflict: boolean; reason?: string } {
  
  for (const appointment of existingAppointments) {
    // Add buffers to existing appointment
    const existingStart = addMinutes(appointment.scheduledStart, -bufferBefore);
    const existingEnd = addMinutes(appointment.scheduledEnd, bufferAfter);

    // Check for overlap
    const hasOverlap = (
      (proposedStart >= existingStart && proposedStart < existingEnd) ||
      (proposedEnd > existingStart && proposedEnd <= existingEnd) ||
      (proposedStart <= existingStart && proposedEnd >= existingEnd)
    );

    if (hasOverlap) {
      return {
        hasConflict: true,
        reason: `Conflito com agendamento às ${format(appointment.scheduledStart, 'HH:mm')}`
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Book appointment atomically with proper conflict checking
 */
export async function bookAppointmentAtomic(options: {
  patientId: string;
  providerIds: string[];
  typeId: string;
  startUtc: Date;
  endUtc: Date;
  requiredResourceIds?: string[];
  createdBy?: string;
  tentative?: boolean;
}): Promise<any> {
  const { patientId, providerIds, typeId, startUtc, endUtc, createdBy, tentative = false } = options;

  // Validate inputs
  if (!patientId || !providerIds?.length || !typeId) {
    throw new Error('Missing required fields');
  }

  const appointmentType = await AppointmentType.findById(typeId);
  if (!appointmentType) {
    throw new Error('Appointment type not found');
  }

  // For simplicity, use the first provider (extend later for multi-provider bookings)
  const providerId = providerIds[0];
  const provider = await Provider.findById(providerId);
  if (!provider || !provider.isActive) {
    throw new Error('Provider not found or inactive');
  }

  // Check for conflicts
  const existingAppointments = await Appointment.find({
    provider: providerId,
    scheduledStart: {
      $gte: startOfDay(startUtc),
      $lt: endOfDay(startUtc)
    },
    status: { $nin: ['cancelled', 'no_show'] }
  });

  const bufferBefore = appointmentType.bufferBefore || provider.bufferTimeBefore || 0;
  const bufferAfter = appointmentType.bufferAfter || provider.bufferTimeAfter || 0;

  const conflict = checkTimeConflict(
    addMinutes(startUtc, -bufferBefore),
    addMinutes(endUtc, bufferAfter),
    existingAppointments,
    0, // Buffers already applied
    0
  );

  if (conflict.hasConflict) {
    throw new Error(`Time slot not available: ${conflict.reason}`);
  }

  // Create appointment
  const appointment = new Appointment({
    patient: patientId,
    clinic: provider.clinic,
    provider: providerId,
    appointmentType: typeId,
    scheduledStart: startUtc,
    scheduledEnd: endUtc,
    status: tentative ? 'scheduled' : 'confirmed',
    priority: 'routine',
    createdBy: createdBy || null
  });

  return await appointment.save();
}