
# Todo

## 🔒 Patch 1 — Secure reset-password flow

**Files:** `src/services/authService.ts` (main), new helper for email sending assumed (`emailService`).

```diff
--- a/src/services/authService.ts
+++ b/src/services/authService.ts
@@
   static async resetPassword(email: string): Promise<any> {
-    const user = await User.findOne({ email });
-    if (!user) {
-      throw new Error('User not found');
-    }
-
-    // Generate more secure temporary password
-    const tempPassword = crypto.randomBytes(12).toString('base64').slice(0, 12);
-    user.password = tempPassword;
-    await user.save();
-
-    // Revoke all existing tokens
-    await this.logoutAllDevices((user._id as any).toString());
-
-    return tempPassword;
+    const user = await User.findOne({ email });
+    if (!user) {
+      throw new Error('User not found');
+    }
+
+    // Generate secure reset token
+    const resetToken = crypto.randomBytes(32).toString('hex');
+    const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');
+
+    // Store hashed token and expiry
+    user.resetPasswordToken = hashed;
+    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60); // 1h
+    await user.save();
+
+    // Revoke all existing refresh tokens for safety
+    await this.logoutAllDevices((user._id as any).toString());
+
+    // Send reset token by email (via a dedicated service)
+    await emailService.sendPasswordReset(user.email, resetToken);
+
+    return true; // do not leak token or password in API response
   }
```

👉 **Also update your `User` model (`src/models/User.ts`)** to include optional fields for reset:

```diff
 const UserSchema = new Schema<IUser>({
   // existing fields...
+  resetPasswordToken: { type: String },
+  resetPasswordExpires: { type: Date },
 });
```

Add a **new endpoint** (if not already present) like `/auth/reset/:token` that verifies the hashed token, ensures it isn’t expired, and then sets the new password provided by the user.

---

## 📅 Patch 2 — Canonical appointment overlap detection

**Files:** `src/services/appointmentService.ts`

```diff
--- a/src/services/appointmentService.ts
+++ b/src/services/appointmentService.ts
@@
-    const overlapping = await Appointment.findOne({
-      provider: data.provider,
-      clinic: data.clinic,
-      status: { $in: ['scheduled', 'confirmed', 'in_progress'] },
-      $or: [
-        {
-          scheduledStart: { $lt: data.scheduledEnd, $gte: data.scheduledStart },
-        },
-        {
-          scheduledEnd: { $gt: data.scheduledStart, $lte: data.scheduledEnd },
-        },
-        {
-          scheduledStart: { $lte: data.scheduledStart },
-          scheduledEnd: { $gte: data.scheduledEnd },
-        },
-      ],
-    });
+    // Canonical overlap condition:
+    // existing.start < new.end AND existing.end > new.start
+    const overlapping = await Appointment.findOne({
+      provider: data.provider,
+      clinic: data.clinic,
+      status: { $in: ['scheduled', 'confirmed', 'in_progress'] },
+      scheduledStart: { $lt: data.scheduledEnd },
+      scheduledEnd: { $gt: data.scheduledStart },
+    });
```

Apply the same logic to **reschedule** and **update** methods wherever overlap checks are repeated.

---

✅ With these two patches:

* Reset-password flow no longer leaks a temporary password; instead it follows secure token-email flow.
* Appointment booking logic uses a canonical, correct overlap check that covers all cases (adjacent vs. overlapping).
