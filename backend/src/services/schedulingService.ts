// backend/src/services/schedulingService.ts
import mongoose from "mongoose";
import { Appointment, AppointmentType, Provider, Resource } from "../models/schedulingModels";
import Redis from "ioredis";
import Redlock from "redlock";
import { Queue } from "bullmq";
import { DateTime } from "luxon";

/**
 * This scheduling service:
 * - Tries to create appointment inside a MongoDB transaction
 * - Uses Redlock to acquire a provider+slot lock as extra safety across processes
 * - Enqueues post-booking jobs (notifications/waitlist handling) using BullMQ
 */

// Configure Redis + Redlock
const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
export const redlock = new Redlock([redis], {
  // recommended: retry settings
  retryCount: 5,
  retryDelay: 200, // ms
});

// Notification queue (worker listens to 'notifications' queue)
const notificationQueue = new Queue("notifications", { connection: redis });

// Types
export interface BookingRequest {
  patientId: string;
  providerIds: string[]; // primary provider id mandatory
  typeId: string;
  startUtc: Date;
  endUtc: Date;
  requiredResourceIds?: string[];
  createdBy?: string;
  tentative?: boolean; // if true, create tentative
}

/**
 * Helper: overlap check
 */
async function hasOverlap(providerId: string, startUtc: Date, endUtc: Date) {
  const overlapping = await Appointment.findOne({
    providerIds: providerId,
    status: { $in: ["tentative", "booked", "confirmed"] },
    $or: [
      { startUtc: { $lt: endUtc }, endUtc: { $gt: startUtc } },
    ],
  }).lean();
  return !!overlapping;
}

/**
 * Main booking function. Returns created appointment doc on success.
 */
export async function bookAppointmentAtomic(req: BookingRequest) {
  // Validate appointment type
  const apptType = await AppointmentType.findById(req.typeId).lean();
  if (!apptType) throw new Error("Invalid appointment type");

  // Acquire distributed lock over provider(s) and timeslot
  const lockKeys = req.providerIds.map(
    (pid) => `locks:provider:${pid}:slot:${req.startUtc.toISOString()}`
  );

  let lock;
  try {
    lock = await redlock.acquire(lockKeys, 30000); // 30s lock
  } catch (err) {
    // lock acquisition failed
    throw new Error("Slot is being booked by another process, please retry");
  }

  // Now perform DB transactional booking
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Re-check overlaps for each provider
    for (const pid of req.providerIds) {
      const conflict = await Appointment.findOne({
        providerIds: pid,
        status: { $in: ["tentative", "booked", "confirmed"] },
        $or: [{ startUtc: { $lt: req.endUtc }, endUtc: { $gt: req.startUtc } }],
      }).session(session).lean();
      if (conflict) {
        throw new Error("Time conflict for provider");
      }
    }

    // Check resources
    if (req.requiredResourceIds && req.requiredResourceIds.length > 0) {
      for (const rid of req.requiredResourceIds) {
        const resConflict = await Appointment.findOne({
          requiredResourceIds: rid,
          status: { $in: ["tentative", "booked", "confirmed"] },
          $or: [{ startUtc: { $lt: req.endUtc }, endUtc: { $gt: req.startUtc } }],
        }).session(session).lean();
        if (resConflict) throw new Error("Resource conflict");
      }
    }

    const appointment = await Appointment.create(
      [
        {
          patientId: req.patientId,
          providerIds: req.providerIds,
          typeId: req.typeId,
          startUtc: req.startUtc,
          endUtc: req.endUtc,
          status: req.tentative ? "tentative" : "booked",
          requiredResourceIds: req.requiredResourceIds || [],
          createdBy: req.createdBy,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // enqueue background job to send confirmation / reminders
    await notificationQueue.add("appointmentCreated", { appointmentId: (appointment[0]._id as any).toString() });

    // release lock
    await lock.release();

    return appointment[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    try {
      await lock.release();
    } catch (_) {}
    throw err;
  }
}
