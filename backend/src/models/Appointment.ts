// backend/src/models/Appointment.ts
import { Schema, model } from 'mongoose';

const AppointmentSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  practitionerId: { type: Schema.Types.ObjectId, ref: 'Practitioner', required: true },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' },
  createdAt: { type: Date, default: Date.now },
});

export const Appointment = model('Appointment', AppointmentSchema);
