// backend/src/routes/twilio.ts
import express from "express";
import bodyParser from "body-parser";
import notificationsService from "../services/notificationsService";

const router = express.Router();

// Twilio webhook expects urlencoded parser
router.use(bodyParser.urlencoded({ extended: false }));

router.post("/twilio/sms", async (req, res) => {
  try {
    const from = req.body.From;
    const body = req.body.Body || "";
    const result = await notificationsService.handleIncomingSms(from, body);
    // Twilio expects XML <Response> optionally; we'll return empty 200
    res.set("Content-Type", "text/xml").send("<Response></Response>");
  } catch (err) {
    console.error("Twilio webhook error", err);
    res.set("Content-Type", "text/xml").status(500).send("<Response></Response>");
  }
});

export default router;
