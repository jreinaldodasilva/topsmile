// backend/src/workers/waitlistWorker.ts
import { Worker, Queue, Job } from "bullmq";
import Redis from "ioredis";
import { WaitlistEntry, Appointment, AppointmentType } from "../models/schedulingModels";
import { bookAppointmentAtomic } from "../services/schedulingService";
import { sendAppointmentNotification } from "../services/notificationsService";
import mongoose from "mongoose";

const connection = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

export const waitlistQueue = new Queue("waitlist", { connection });
export const notificationQueue = new Queue("notifications", { connection });

/**
 * Worker job: process a canceled timeslot and attempt to fill it from waitlist.
 *
 * Job data example:
 * { cancelledSlotStartUtc: '...', cancelledSlotEndUtc: '...', providerId: '...', typeId: '...' }
 */

const waitlistWorker = new Worker(
  "waitlist",
  async (job: Job) => {
    const data = job.data;
    const start = new Date(data.cancelledSlotStartUtc);
    const end = new Date(data.cancelledSlotEndUtc);
    const providerId = data.providerId;
    const typeId = data.typeId;

    // find waitlist entries matching type or any, ordered by priority and createdAt
    const matchQuery: any = {
      processed: false,
      $and: [
        // requested types match OR no requested types specified (treat as wildcard)
        {
          $or: [
            { requestedTypeIds: { $in: [typeId] } },
            { requestedTypeIds: { $exists: true, $size: 0 } },
            { requestedTypeIds: { $exists: false } },
          ],
        },
        // earliestUtc condition: either not set OR earliestUtc <= slot end
        {
          $or: [{ earliestUtc: { $exists: false } }, { earliestUtc: { $lte: end } }],
        },
        // latestUtc condition: either not set OR latestUtc >= slot start
        {
          $or: [{ latestUtc: { $exists: false } }, { latestUtc: { $gte: start } }],
        },
      ],
    };


    const candidate = await WaitlistEntry.findOne(matchQuery).sort({ priority: -1, createdAt: 1 }).lean();
    if (!candidate) {
      return { filled: false };
    }

    // Attempt to book tentatively for the candidate patient
    try {
      const appt = await bookAppointmentAtomic({
        patientId: candidate.patientId.toString(),
        providerIds: [providerId],
        typeId: typeId,
        startUtc: start,
        endUtc: end,
        tentative: true,
        createdBy: undefined,
      });

      // Mark waitlist entry processed
      await WaitlistEntry.updateOne({ _id: candidate._id }, { $set: { processed: true } });

      // enqueue notification — ask for confirmation (two-way)
      await notificationQueue.add("confirmWaitlistBooking", {
        appointmentId: (appt._id as any).toString(),
        waitlistEntryId: candidate._id.toString(),
      });

      return { filled: true, appointmentId: (appt._id as any).toString() };
    } catch (err) {
      // booking failed (race) — leave entry unprocessed for next attempt
      return { filled: false, error: (err as Error).message };
    }
  },
  { connection }
);

// Notification worker (very simple demonstration)
const notificationWorker = new Worker(
  "notifications",
  async (job: Job) => {
    const { name } = job;
    const data = job.data;
    if (name === "appointmentCreated") {
      // find appointment and notify
      const appt = await Appointment.findById(data.appointmentId).lean();
      if (!appt) return;
      await sendAppointmentNotification(appt._id.toString(), "created");
    } else if (name === "confirmWaitlistBooking") {
      // send "confirm this booking within X minutes" message
      const appt = await Appointment.findById(data.appointmentId).lean();
      if (!appt) return;
      await sendAppointmentNotification(appt._id.toString(), "confirm_waitlist");
      // Optionally: add a delayed job that auto-releases if not confirmed in 30 mins
      await notificationQueue.add(
        "waitlistConfirmationTimeout",
        { appointmentId: appt._id.toString(), waitlistEntryId: data.waitlistEntryId },
        { delay: 30 * 60 * 1000 } // 30 min
      );
    } else if (name === "waitlistConfirmationTimeout") {
      // check appointment still tentative and not confirmed -> cancel & re-enqueue waitlist fill
      const appt = await Appointment.findById(data.appointmentId).lean();
      if (!appt) return;
      if (appt.status === "tentative") {
        await Appointment.updateOne({ _id: appt._id }, { $set: { status: "cancelled" } });
        // re-open slot -> trigger waitlist fill job (could pass slot info)
        await waitlistQueue.add("processCancelledSlot", {
          cancelledSlotStartUtc: appt.startUtc,
          cancelledSlotEndUtc: appt.endUtc,
          providerId: appt.providerIds[0] ? appt.providerIds[0].toString() : null,
          typeId: appt.typeId.toString(),
        });
      }
    }
  },
  { connection }
);

export default { waitlistWorker, notificationWorker };
