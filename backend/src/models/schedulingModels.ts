// backend/src/models/schedulingModels.ts
import mongoose, { Document, Schema } from "mongoose";

/**
 * Use UTC for start/end storage. Save provider timezone on Provider doc.
 * Indexes: provider + startUtc for fast overlap checks.
 */

// -----------------------------
// AppointmentType
// -----------------------------
export interface IAppointmentType extends Document {
  name: string;
  durationMin: number;
  bufferBeforeMin: number;
  bufferAfterMin: number;
  requiredResourceTypes?: string[]; // resource type names
  requiredProviderRoles?: string[]; // e.g. ['dentist', 'hygienist']
  color?: string;
  description?: string;
}

const AppointmentTypeSchema = new Schema<IAppointmentType>(
  {
    name: { type: String, required: true },
    durationMin: { type: Number, required: true, default: 30 },
    bufferBeforeMin: { type: Number, required: true, default: 0 },
    bufferAfterMin: { type: Number, required: true, default: 0 },
    requiredResourceTypes: [{ type: String }],
    requiredProviderRoles: [{ type: String }],
    color: String,
    description: String,
  },
  { timestamps: true }
);

export const AppointmentType = mongoose.model<IAppointmentType>(
  "AppointmentType",
  AppointmentTypeSchema
);

// -----------------------------
// Provider
// -----------------------------
export interface IProvider extends Document {
  name: string;
  roles: string[]; // e.g. ['dentist','assistant']
  timezone?: string; // e.g. 'America/Sao_Paulo'
  metadata?: any;
  isActive: boolean;
}

const ProviderSchema = new Schema<IProvider>(
  {
    name: { type: String, required: true },
    roles: [{ type: String, required: true }],
    timezone: { type: String, default: "UTC" },
    metadata: { type: Schema.Types.Mixed },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Provider = mongoose.model<IProvider>("Provider", ProviderSchema);

// -----------------------------
// Resource (room, chair, equipment)
// -----------------------------
export interface IResource extends Document {
  name: string;
  type: string;
  metadata?: any;
  isActive: boolean;
}

const ResourceSchema = new Schema<IResource>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Resource = mongoose.model<IResource>("Resource", ResourceSchema);

// -----------------------------
// ProviderSchedule - weekly pattern + exceptions
// -----------------------------
export type WeeklyWindow = { dayOfWeek: number; start: string; end: string };
// exceptions: date string ISO (YYYY-MM-DD) with either closed true or modified windows
export interface IScheduleException {
  date: string; // 'YYYY-MM-DD'
  type: "closed" | "modified";
  windows?: { start: string; end: string }[]; // when type='modified'
}

export interface IProviderSchedule extends Document {
  providerId: mongoose.Types.ObjectId;
  weekly: WeeklyWindow[]; // e.g. Monday 08:00-17:00 -> dayOfWeek: 1
  breaks?: { start: string; end: string }[]; // daily breaks times
  exceptions?: IScheduleException[];
  emergencySlots?: { date?: string; start: string; end: string }[]; // optional reserved emergency blocks
}

const ProviderScheduleSchema = new Schema<IProviderSchedule>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "Provider", required: true, index: true },
    weekly: [
      {
        dayOfWeek: { type: Number, min: 0, max: 6, required: true },
        start: { type: String, required: true }, // '08:00'
        end: { type: String, required: true }, // '17:00'
      },
    ],
    breaks: [{ start: String, end: String }],
    exceptions: [
      {
        date: String,
        type: { type: String, enum: ["closed", "modified"], default: "closed" },
        windows: [{ start: String, end: String }],
      },
    ],
    emergencySlots: [{ date: String, start: String, end: String }],
  },
  { timestamps: true }
);

export const ProviderSchedule = mongoose.model<IProviderSchedule>(
  "ProviderSchedule",
  ProviderScheduleSchema
);

// -----------------------------
// RecurrenceSeries (RRULE)
// -----------------------------
export interface IRecurrenceSeries extends Document {
  rrule: string; // RFC5545 rrule string
  timezone?: string;
  ownerId?: mongoose.Types.ObjectId; // who created series
  exceptions?: string[]; // list of dates excluded
  createdAt: Date;
  updatedAt: Date;
}

const RecurrenceSeriesSchema = new Schema<IRecurrenceSeries>(
  {
    rrule: { type: String, required: true },
    timezone: { type: String, default: "UTC" },
    ownerId: { type: Schema.Types.ObjectId },
    exceptions: [{ type: String }],
  },
  { timestamps: true }
);

export const RecurrenceSeries = mongoose.model<IRecurrenceSeries>(
  "RecurrenceSeries",
  RecurrenceSeriesSchema
);

// -----------------------------
// Appointment
// -----------------------------
export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  providerIds: mongoose.Types.ObjectId[]; // primary provider + others (co-book)
  typeId: mongoose.Types.ObjectId;
  startUtc: Date;
  endUtc: Date;
  status:
    | "tentative"
    | "booked"
    | "confirmed"
    | "cancelled"
    | "no-show"
    | "completed";
  requiredResourceIds?: mongoose.Types.ObjectId[];
  parentSeriesId?: mongoose.Types.ObjectId;
  metadata?: any;
  createdBy?: mongoose.Types.ObjectId;
  notes?: string;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, required: true, index: true },
    providerIds: [{ type: Schema.Types.ObjectId, ref: "Provider", required: true, index: true }],
    typeId: { type: Schema.Types.ObjectId, ref: "AppointmentType", required: true },
    startUtc: { type: Date, required: true, index: true },
    endUtc: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["tentative", "booked", "confirmed", "cancelled", "no-show", "completed"],
      default: "tentative",
      index: true,
    },
    requiredResourceIds: [{ type: Schema.Types.ObjectId, ref: "Resource" }],
    parentSeriesId: { type: Schema.Types.ObjectId, ref: "RecurrenceSeries" },
    metadata: Schema.Types.Mixed,
    createdBy: { type: Schema.Types.ObjectId },
    notes: String,
  },
  { timestamps: true }
);

// Compound index to speed overlap checks for provider
AppointmentSchema.index({ providerIds: 1, startUtc: 1, endUtc: 1 });
AppointmentSchema.index({ startUtc: 1, endUtc: 1, status: 1 });

export const Appointment = mongoose.model<IAppointment>("Appointment", AppointmentSchema);

// -----------------------------
// WaitlistEntry
// -----------------------------
export interface IWaitlistEntry extends Document {
  patientId: mongoose.Types.ObjectId;
  requestedTypeIds?: mongoose.Types.ObjectId[]; // acceptable types
  preferredProviders?: mongoose.Types.ObjectId[];
  earliestUtc?: Date;
  latestUtc?: Date;
  contactMethods?: { sms?: boolean; email?: boolean };
  priority?: number;
  createdAt: Date;
  processed?: boolean;
}

const WaitlistEntrySchema = new Schema<IWaitlistEntry>(
  {
    patientId: { type: Schema.Types.ObjectId, required: true, index: true },
    requestedTypeIds: [{ type: Schema.Types.ObjectId, ref: "AppointmentType" }],
    preferredProviders: [{ type: Schema.Types.ObjectId, ref: "Provider" }],
    earliestUtc: Date,
    latestUtc: Date,
    contactMethods: { sms: { type: Boolean, default: true }, email: { type: Boolean, default: true } },
    priority: { type: Number, default: 0 },
    processed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const WaitlistEntry = mongoose.model<IWaitlistEntry>("WaitlistEntry", WaitlistEntrySchema);

// -----------------------------
// TreatmentPlan (optionally used for multi-appt treatments)
// -----------------------------
export interface ITreatmentPlan extends Document {
  patientId: mongoose.Types.ObjectId;
  steps: {
    appointmentTypeId: mongoose.Types.ObjectId;
    minDaysAfterPrev?: number;
    maxDaysAfterPrev?: number;
    preferredProviderRoles?: string[];
    notes?: string;
  }[];
  status?: "active" | "completed" | "cancelled";
}

const TreatmentPlanSchema = new Schema<ITreatmentPlan>({
  patientId: { type: Schema.Types.ObjectId, required: true },
  steps: [
    {
      appointmentTypeId: { type: Schema.Types.ObjectId, ref: "AppointmentType", required: true },
      minDaysAfterPrev: Number,
      maxDaysAfterPrev: Number,
      preferredProviderRoles: [{ type: String }],
      notes: String,
    },
  ],
  status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
});

export const TreatmentPlan = mongoose.model<ITreatmentPlan>("TreatmentPlan", TreatmentPlanSchema);

