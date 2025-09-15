
## 🔒 Tests for reset-password flow

**File:** `tests/auth/resetPassword.test.ts`

```ts
import crypto from "crypto";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app";
import User from "../../src/models/User";
import { emailService } from "../../src/services/emailService";

jest.mock("../../src/services/emailService");

describe("Reset Password Flow", () => {
  let user: any;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL!);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    user = await User.create({
      email: "reset@test.com",
      password: "OldP@ssword1",
    });
    (emailService.sendPasswordReset as jest.Mock).mockClear();
  });

  it("should generate reset token and send via email", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ email: user.email })
      .expect(200);

    expect(res.body.success).toBe(true);
    const updated = await User.findById(user._id);
    expect(updated?.resetPasswordToken).toBeDefined();
    expect(updated?.resetPasswordExpires).toBeInstanceOf(Date);
    expect(emailService.sendPasswordReset).toHaveBeenCalledWith(
      user.email,
      expect.any(String)
    );
  });

  it("should reject reset with expired token", async () => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = new Date(Date.now() - 1000); // expired
    await user.save();

    const res = await request(app)
      .post(`/api/auth/reset/${resetToken}`)
      .send({ newPassword: "N3wP@ssword!" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should allow password update with valid token", async () => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
    await user.save();

    const res = await request(app)
      .post(`/api/auth/reset/${resetToken}`)
      .send({ newPassword: "N3wP@ssword!" })
      .expect(200);

    expect(res.body.success).toBe(true);

    const updated = await User.findById(user._id);
    expect(updated?.resetPasswordToken).toBeFalsy();
    expect(updated?.password).not.toBe("OldP@ssword1"); // hashed
  });
});
```

---

## 📅 Tests for appointment overlap detection

**File:** `tests/appointments/overlap.test.ts`

```ts
import mongoose from "mongoose";
import Appointment from "../../src/models/Appointment";
import { createAppointment } from "../../src/services/appointmentService";

describe("Appointment Overlap Detection", () => {
  let clinicId: mongoose.Types.ObjectId;
  let providerId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL!);
    clinicId = new mongoose.Types.ObjectId();
    providerId = new mongoose.Types.ObjectId();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Appointment.deleteMany({});
  });

  it("should reject exact same time slot", async () => {
    await Appointment.create({
      provider: providerId,
      clinic: clinicId,
      scheduledStart: new Date("2025-01-01T10:00:00Z"),
      scheduledEnd: new Date("2025-01-01T10:30:00Z"),
      status: "scheduled",
    });

    await expect(
      createAppointment({
        provider: providerId,
        clinic: clinicId,
        scheduledStart: new Date("2025-01-01T10:00:00Z"),
        scheduledEnd: new Date("2025-01-01T10:30:00Z"),
      })
    ).rejects.toThrow(/overlap/i);
  });

  it("should reject overlapping interval (partial overlap)", async () => {
    await Appointment.create({
      provider: providerId,
      clinic: clinicId,
      scheduledStart: new Date("2025-01-01T10:00:00Z"),
      scheduledEnd: new Date("2025-01-01T10:30:00Z"),
      status: "scheduled",
    });

    await expect(
      createAppointment({
        provider: providerId,
        clinic: clinicId,
        scheduledStart: new Date("2025-01-01T10:15:00Z"),
        scheduledEnd: new Date("2025-01-01T10:45:00Z"),
      })
    ).rejects.toThrow(/overlap/i);
  });

  it("should allow adjacent appointments (end == start)", async () => {
    await Appointment.create({
      provider: providerId,
      clinic: clinicId,
      scheduledStart: new Date("2025-01-01T10:00:00Z"),
      scheduledEnd: new Date("2025-01-01T10:30:00Z"),
      status: "scheduled",
    });

    await expect(
      createAppointment({
        provider: providerId,
        clinic: clinicId,
        scheduledStart: new Date("2025-01-01T10:30:00Z"),
        scheduledEnd: new Date("2025-01-01T11:00:00Z"),
      })
    ).resolves.toBeDefined();
  });
});
```

---

### ✅ What you get with these additions:

* Reset-password flow tested end-to-end (token creation, expiry, success).
* Appointment overlap logic validated for exact match, partial overlap, and adjacency.

---

Do you want me to **bundle these into the same PR** as the earlier diffs (so one branch with both fixes + tests), or do you prefer **two separate PRs** (one for security, one for scheduling)?

