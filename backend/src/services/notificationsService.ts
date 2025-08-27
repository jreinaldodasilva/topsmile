// backend/src/services/notificationsService.ts
import nodemailer from "nodemailer";
import Twilio from "twilio";
import { Appointment, Provider } from "../models/schedulingModels";
import { DateTime } from "luxon";
import dotenv from "dotenv";

dotenv.config();

// Configure nodemailer (example ethereal / sendgrid)
const createTransporter = () => {
  if (process.env.NODE_ENV === "production" && process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      service: "SendGrid",
      auth: { user: "apikey", pass: process.env.SENDGRID_API_KEY },
    });
  }
  // dev: ethereal or SMTP config via env
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: Number(process.env.SMTP_PORT || 587),
    auth: {
      user: process.env.SMTP_USER || process.env.ETHEREAL_USER,
      pass: process.env.SMTP_PASS || process.env.ETHEREAL_PASS,
    },
  });
};

const transporter = createTransporter();

// Twilio
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || "noreply@topsmile.com",
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Failed to send email", err);
    throw err;
  }
}

async function sendSms(to: string, body: string) {
  if (!twilioClient) {
    console.warn("Twilio not configured - skipping SMS:", body);
    return;
  }
  const from = process.env.TWILIO_FROM_NUMBER;
  return await twilioClient.messages.create({ body, from, to });
}

/**
 * Build basic templates - real app should use templating engine
 */
function buildAppointmentText(appt: any, mode: "created" | "reminder" | "confirm_waitlist") {
  // For simplicity: assume appt has startUtc and providerIds etc
  const start = DateTime.fromJSDate(new Date(appt.startUtc)).toLocaleString(DateTime.DATETIME_MED);
  const providerName = appt.providerIds && appt.providerIds[0] ? appt.providerIds[0].name || "Provider" : "Provider";

  if (mode === "created")
    return `Olá! Sua consulta em ${start} com ${providerName} foi agendada. Responda 'YES' para confirmar ou 'NO' para cancelar.`;
  if (mode === "reminder") return `Lembrete: consulta em ${start} com ${providerName}. Por favor confirme.`;
  if (mode === "confirm_waitlist")
    return `Uma vaga apareceu: consulta em ${start} com ${providerName}. Responda 'YES' para aceitar (válido por 30 minutos).`;
  return "";
}

export async function sendAppointmentNotification(appointmentId: string, mode: "created" | "reminder" | "confirm_waitlist") {
  // fetch appointment with provider/populated patient contact in real DB
  const appt = await Appointment.findById(appointmentId).lean();
  if (!appt) return;
  // For demo: assume appt.metadata contains patient contact: { email, phone, name }
  const patientEmail = appt["metadata"]?.email;
  const patientPhone = appt["metadata"]?.phone;
  // For provider names you'd normally populate
  let provider = null;
  if (appt.providerIds && appt.providerIds[0]) provider = await Provider.findById(appt.providerIds[0]).lean();

  const text = buildAppointmentText({ ...appt, providerIds: provider ? [provider] : appt.providerIds }, mode);

  if (patientEmail) {
    await sendEmail(patientEmail, "TopSmile - sua consulta", `<p>${text}</p>`);
  }
  if (patientPhone) {
    await sendSms(patientPhone, text);
  }
}

export async function handleIncomingSms(from: string, body: string) {
  // simple parser: 'YES' confirms tentative appointment, 'NO' cancels
  const txt = body.trim().toLowerCase();
  // In practice, you'd parse inbound message to match appointment by code or by recent tentative appointment
  // This demo finds latest tentative appointment for this phone number
  const appt = await Appointment.findOne({ "metadata.phone": from, status: "tentative" }).sort({ createdAt: -1 }).exec();
  if (!appt) {
    return { ok: false, message: "No tentative appointment found" };
  }
  if (txt.startsWith("y")) {
    appt.status = "confirmed";
    await appt.save();
    // notify user
    await sendSms(from, "Obrigado — sua consulta foi confirmada!");
    return { ok: true, action: "confirmed" };
  } else if (txt.startsWith("n")) {
    appt.status = "cancelled";
    await appt.save();
    await sendSms(from, "Sua consulta foi cancelada. Entraremos em contato para reagendar.");
    // enqueue waitlist fill job (simplified)
    return { ok: true, action: "cancelled" };
  } else {
    return { ok: false, message: "Comando não reconhecido. Responda YES ou NO." };
  }
}

export default {
  sendEmail,
  sendSms,
  sendAppointmentNotification,
  handleIncomingSms,
};
