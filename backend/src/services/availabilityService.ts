// backend/src/services/availabilityService.ts
import { Appointment, AppointmentType, Provider, ProviderSchedule, Resource } from "../models/schedulingModels";
import { DateTime } from "luxon";
import { toProviderLocal, roundToNearestMinutes } from "../utils/time";
import mongoose from "mongoose";

/**
 * Availability engine:
 * - Given providerId (or multiple providers) + appointmentType + dateRange => list of candidate slots
 * - Uses provider weekly schedule & exceptions
 *
 * This implementation focuses on single-provider availability. For multi-provider or resource checks,
 * pass providerIds array and resource types and perform checks for overlaps on all providers/resources.
 */

interface AvailabilityRequest {
  providerId: string;
  appointmentTypeId: string;
  fromIso: string; // '2025-09-01'
  toIso: string;   // '2025-09-07'
  granularityMin?: number;
  maxResults?: number;
  earliestTime?: string; // '08:00' local
  latestTime?: string;   // '18:00' local
  patientTimezone?: string;
}

interface CandidateSlot {
  startUtc: Date;
  endUtc: Date;
  score: number;
  providerId: string;
  reasons?: string[];
}

export async function generateAvailability(req: AvailabilityRequest): Promise<CandidateSlot[]> {
  const granularity = req.granularityMin ?? 15;
  const maxResults = req.maxResults ?? 20;

  const provider = await Provider.findById(req.providerId).lean();
  if (!provider) throw new Error("Provider not found");
  const providerTz = provider.timezone || "UTC";

  const apptType = await AppointmentType.findById(req.appointmentTypeId).lean();
  if (!apptType) throw new Error("AppointmentType not found");

  const schedule = await ProviderSchedule.findOne({ providerId: provider._id }).lean();
  if (!schedule) {
    throw new Error("Provider schedule not configured");
  }

  // convert date range (in provider local) to DateTime objects
  const startDate = DateTime.fromISO(req.fromIso, { zone: providerTz }).startOf("day");
  const endDate = DateTime.fromISO(req.toIso, { zone: providerTz }).endOf("day");

  const candidates: CandidateSlot[] = [];

  // iterate days
  for (let day = startDate; day <= endDate; day = day.plus({ days: 1 })) {
    const isoDate = day.toISODate();

    // check exceptions
    const exception = (schedule.exceptions || []).find((e) => e.date === isoDate);
    let windows: { start: string; end: string }[] = [];

    if (exception) {
      if (exception.type === "closed") {
        windows = [];
      } else if (exception.type === "modified" && exception.windows) {
        windows = exception.windows.map((w) => ({ start: w.start, end: w.end }));
      }
    } else {
      // weekly windows for that day
      const dow = day.weekday % 7; // luxon: Monday=1,...Sunday=7 => map to 0..6 by %7 -> Monday=1
      const weeklyForDay = (schedule.weekly || []).filter((w) => w.dayOfWeek === dow);
      windows = weeklyForDay.map((w) => ({ start: w.start, end: w.end }));
    }

    for (const win of windows) {
      // apply optional earliest/latest filters (local times)
      const windowStartLocal = DateTime.fromISO(`${isoDate}T${win.start}`, { zone: providerTz });
      const windowEndLocal = DateTime.fromISO(`${isoDate}T${win.end}`, { zone: providerTz });

      let slotCursor = roundToNearestMinutes(windowStartLocal, granularity, false);
      const apptDuration = apptType.durationMin;
      const bufferBefore = apptType.bufferBeforeMin || 0;
      const bufferAfter = apptType.bufferAfterMin || 0;

      while (slotCursor.plus({ minutes: apptDuration + bufferAfter }).toMillis() <= windowEndLocal.toMillis()) {
        const slotStartUtc = slotCursor.toUTC();
        const slotEndUtc = slotCursor.plus({ minutes: apptDuration }).toUTC();

        // overlap check with existing appointments for this provider
        const overlap = await Appointment.findOne({
          providerIds: provider._id,
          status: { $in: ["tentative", "booked", "confirmed"] },
          $or: [
            { startUtc: { $lt: slotEndUtc.toJSDate() }, endUtc: { $gt: slotStartUtc.toJSDate() } },
          ],
        }).lean();

        // check resource availability (simple example: if APPT type requires resource types)
        let resourceConflict = false;
        if (apptType.requiredResourceTypes && apptType.requiredResourceTypes.length > 0) {
          // naive approach: find any resource of the required type that is free
          for (const rtype of apptType.requiredResourceTypes) {
            const busy = await Appointment.findOne({
              requiredResourceIds: { $exists: true, $ne: [] },
              status: { $in: ["tentative", "booked", "confirmed"] },
              $or: [
                { startUtc: { $lt: slotEndUtc.toJSDate() }, endUtc: { $gt: slotStartUtc.toJSDate() } },
              ],
            }).lean();
            if (busy) {
              resourceConflict = true;
              break;
            }
          }
        }

        if (!overlap && !resourceConflict) {
          // basic scoring - prefer earlier slots and those closer to provider preferred hours
          const minutesFromNow = Math.max(0, Math.round((slotStartUtc.toMillis() - Date.now()) / 60000));
          let score = 1000 - minutesFromNow; // earlier is better

          // prefer slots inside core hours (example 9-15)
          const localHour = slotCursor.hour;
          if (localHour >= 9 && localHour <= 15) score += 50;

          candidates.push({
            startUtc: slotStartUtc.toJSDate(),
            endUtc: slotEndUtc.toJSDate(),
            score,
            providerId: provider._id.toString(),
            reasons: [],
          });
        }

        slotCursor = slotCursor.plus({ minutes: granularity });
      }
    }
  }

  // sort by score desc then start time asc
  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.startUtc.getTime() - b.startUtc.getTime();
  });

  return candidates.slice(0, maxResults);
}
