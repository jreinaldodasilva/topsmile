# TYPE_ALIGNMENT_TODO.md

This file enumerates the top-5 prioritized actions to improve type-safety and API contract alignment across TopSmile. Each item contains: a short description, justification, exact files/locations to change (use grep tokens where appropriate), suggested edits (unified-diff style snippets), and verification steps.

> **Note:** I performed a static review of the repository and prepared these remediation tasks. If you want I can also produce actual patch files (unified diffs) for any or all tasks.

---

## 1) Fix frontend ↔ backend dashboard endpoint mismatch

**Priority:** Critical

**Why:** Frontend calls `/api/dashboard/stats` but backend exposes `/api/admin/dashboard` → runtime 404s for dashboard features.

**Files to update:**
- Frontend service file(s): `src/services/apiService.ts` (search for `/api/dashboard/stats`)
- Any frontend tests or mocks referencing the old path: `src/tests/**`, `src/mocks/**` (grep token: `dashboard/stats`)

**Grep tokens to find occurrences:**
- `dashboard/stats`
- `getDashboardStats(`

**Suggested change (unified-diff style):**
```diff
*** a/src/services/apiService.ts
--- b/src/services/apiService.ts
@@
-  const res = await request(`/api/dashboard/stats`, { method: 'GET' });
+  const res = await request(`/api/admin/dashboard`, { method: 'GET' });
```

**Verification steps:**
1. Run front-end dev (or run the function in unit tests/mocks) and confirm network call goes to `/api/admin/dashboard` and backend returns expected `DashboardStats` shape.
2. Update any tests/mocks that referenced the old path.

**Assumption:** frontend `apiService` centralizes HTTP requests; if dashboard calls exist elsewhere, apply same replacement.

---

## 2) Add `/api/health` endpoint or adjust frontend health check

**Priority:** High

**Why:** Frontend expects a health endpoint (`/api/health`) but the backend repository lacks a dedicated health route. This can cause monitoring or UX failures.

**Files to update (option A - backend):**
- Create: `backend/src/routes/health.ts`
- Update: `backend/src/app.ts` (or wherever routes are mounted) to `app.use('/api/health', healthRouter)`

**Suggested `health.ts` (example):**
```ts
import { Router } from 'express';
const router = Router();
router.get('/', async (req, res) => {
  // Basic liveness check + optional DB
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});
export default router;
```

**Files to update (option B - frontend):**
- Update frontend calls in `src/services/apiService.ts` (grep token `api/health`) and point to currently existing backend endpoint (if any), or remove the call if not needed.

**Verification steps:**
1. `curl` the endpoint `/api/health` and confirm 200.
2. Update any monitoring tools.

**Assumption:** There is no existing health route; if there is a different path used in production, prefer aligning frontend instead.

---

## 3) Canonicalize reference IDs in DTOs (`patientId`, `clinicId`, `providerId`)

**Priority:** High

**Why:** Shared `Create*DTO` types currently allow `string | Object` for ref fields (e.g., `patient: string | Patient`) which blurs whether an ID or nested object should be sent. Backend Mongoose schemas expect `ObjectId` references. Use ID-first DTOs for create/update operations to avoid runtime coercion errors.

**Files to update:**
- Shared types package: `packages/types/src/index.ts` (or equivalent). Search for `CreateAppointmentDTO`, `CreateXDTO`, and types with `patient: string | Patient`.
- Frontend consumers: `src/services/apiService.ts` and any components/pages that construct appointment payloads (grep tokens: `CreateAppointmentDTO`, `createAppointment`, `patient:` followed by object literals in API calls).
- Backend services: `backend/src/services/*` and route handlers (appointments) to accept `patientId` fields (or document conversion).

**Grep tokens to find occurrences:**
- `CreateAppointmentDTO`
- `patient:` (in JSON or object payloads near api calls)
- `clinic:`
- `provider:`

**Suggested change in `packages/types` (unified-diff style):**
```diff
-export type CreateAppointmentDTO = {
-  patient: string | Patient;
-  clinic: string | Clinic;
-  provider: string | Provider;
-  appointmentType: string | AppointmentType;
+export type CreateAppointmentDTO = {
+  // canonical: use IDs for create/update server payloads
+  patientId: string;
+  clinicId: string;
+  providerId: string;
+  appointmentTypeId: string;
   scheduledStart: string | Date;
   scheduledEnd: string | Date;
   status: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
 };
```

**Backend tolerance helper (optional):**
- Add a small helper in `backend/src/utils/coerceRefs.ts` to accept either an object with `_id` or a string and return the id:
```ts
export function toId(ref: any): string {
  if (!ref) return ref;
  if (typeof ref === 'string') return ref;
  if (ref._id) return String(ref._id);
  if (ref.id) return String(ref.id);
  throw new Error('Invalid reference; expected id or object with _id');
}
```

**Frontend changes:**
- Ensure components/pages send `{ patientId }` instead of `{ patient }`. Update types imports to the new DTO names.

**Verification steps:**
1. Unit test: create appointment via API client and assert a 201 and DB record with correct `patient` ObjectId.
2. Run static `tsc` to ensure no type errors after changing shared types.

**Assumption:** Server services read IDs and assign them on the model (common practice). If server expects nested objects, add the `toId` helper.

---

## 4) Centralize error handling to normalize `ApiResult` response shape

**Priority:** High

**Why:** Backend returns inconsistent error shapes across controllers. Frontend expects the `ApiResult<T>` shape from `packages/types`. Centralizing eliminates guessing and infinite defensive checks.

**Files to update / add:**
- Add `backend/src/middleware/errorHandler.ts` (if not present)
- Ensure `backend/src/app.ts` (or main express bootstrap) uses it: `app.use(errorHandler)` after routes
- Optionally update controllers to `throw` errors with `{ status, message, errors }` which errorHandler will catch.

**Suggested `errorHandler.ts` (example):**
```ts
import { Request, Response, NextFunction } from 'express';
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];
  res.status(status).json({ success: false, message, errors });
}
```

**Controller change pattern (example):**
```diff
- return res.status(400).json({ ok: false, error: 'Invalid' });
+ // prefer throwing and let errorHandler normalize
+ throw { status: 400, message: 'Invalid payload', errors: [...] };
```

**Frontend changes:**
- In `src/services/http.ts` (or request wrapper), ensure parsing of error responses reads `.message` and `.errors` from body when `!response.ok`.

**Verification steps:**
1. Trigger a validation error and confirm the frontend receives `{ success: false, message, errors }` consistently.

**Assumption:** There is a single express app bootstrap file `backend/src/app.ts` where middleware can be registered.

---

## 5) Remove `any` in critical paths (auth, appointments, patients)

**Priority:** Medium-High

**Why:** `any` defeats TypeScript guarantees and hides drifting interfaces.

**Targets:**
- Backend: `backend/src/services/authService.ts`, `backend/src/services/schedulingService.ts`, `backend/src/routes/appointments.ts` — grep tokens: `: any`, `as any` in those directories.
- Frontend: `src/services/apiService.ts`, `src/components/*` that receive API responses declared as `any`.

**Suggested approach:**
1. Run `grep -R "\: any\b" backend/src | sed -n '1,120p'` to list candidates (do locally).
2. Replace `any` with the correct shared type from `packages/types` (e.g., `User`, `CreateAppointmentDTO`, `Appointment`) or `unknown` (then narrow at runtime).

**Example replacement (backend scheduling service):**
```diff
-async function createAppointment(payload: any) {
+async function createAppointment(payload: CreateAppointmentDTO) {
   // ... implementation ...
 }
```

**Verification steps:**
1. Run `tsc -p` locally (or CI) to validate type errors introduced by stricter types.
2. Adjust minor mismatched code until compilation is clean.

**Assumption:** Shared types package exports all necessary types; if not, add the missing exports (e.g., `CreateAppointmentDTO`).

---

# Appendix — Helpful grep patterns and commands

Use these locally (example macOS/Linux/bash):

- Find occurrences of dashboard path: `rg "dashboard/stats|/api/dashboard" -n`
- Find health references: `rg "api/health" -n`
- Find DTO definitions: `rg "CreateAppointmentDTO|Create.*DTO" -n packages`
- Find `any` usage: `rg "\: any\b|as any" -n src backend packages`
- Find type imports: `rg "packages/types" -n`

---

# Next steps (if you want patches)

I can produce unified-diff patches for any of the above tasks (one or more). You previously indicated you want a TODO file — it's been created here. If you'd like, tell me which tasks to convert into patch files and I will output the diffs ready to apply.


---

*End of TYPE_ALIGNMENT_TODO.md*

