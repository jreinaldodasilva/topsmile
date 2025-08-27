// backend/src/routes/appointments.ts
import express from "express";
import { generateAvailability } from "../services/availabilityService";
import { bookAppointmentAtomic } from "../services/schedulingService";
import { AppointmentType, Provider, Appointment } from "../models/schedulingModels";

const router = express.Router();

router.get("/providers/:providerId/availability", async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const { from, to, typeId, granularity } = req.query;
    if (!from || !to || !typeId) return res.status(400).json({ error: "from,to,typeId required" });

    const slots = await generateAvailability({
      providerId,
      appointmentTypeId: typeId as string,
      fromIso: from as string,
      toIso: to as string,
      granularityMin: granularity ? Number(granularity) : 15,
    });

    return res.json({ ok: true, slots });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/book", async (req, res) => {
  /**
   * body:
   * {
   *   patientId,
   *   providerIds: [..],
   *   typeId,
   *   startUtc: "2025-09-01T12:00:00Z",
   *   endUtc: "2025-09-01T12:30:00Z",
   *   requiredResourceIds: []
   * }
   */
  try {
    const body = req.body;
    if (!body.patientId || !body.providerIds || !body.typeId || !body.startUtc || !body.endUtc) {
      return res.status(400).json({ error: "missing fields" });
    }

    const appt = await bookAppointmentAtomic({
      patientId: body.patientId,
      providerIds: body.providerIds,
      typeId: body.typeId,
      startUtc: new Date(body.startUtc),
      endUtc: new Date(body.endUtc),
      requiredResourceIds: body.requiredResourceIds || [],
      createdBy: undefined,
      tentative: !!body.tentative,
    });

    return res.json({ ok: true, appointment: appt });
  } catch (err: any) {
    console.error("Booking error:", err);
    return res.status(400).json({ ok: false, error: err.message });
  }
});

export default router;
