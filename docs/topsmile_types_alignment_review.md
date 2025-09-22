# TopSmile — Type Alignment & Contract Audit

**Scope:** static code review of the uploaded repository `topsmile-main.zip` (backend Node/Express/TS + frontend React/TS). I inspected the codebase under `/mnt/data/topsmile/topsmile-main` and the local shared types package at `packages/types`. I **did not run any code**. Where I make assumptions I label them.

---

## 1) Executive summary

**Short:** The project already uses a single, local shared types package (`packages/types`) and both backend and frontend import that package — this is a powerful foundation for strong type-safety. However, there are a number of practical mismatches and risks that could lead to runtime bugs:

* **Critical endpoint mismatch:** Frontend calls `/api/dashboard/stats` but backend exposes `/api/admin/dashboard` (and similar small path inconsistencies). These will cause 404s.
* **Missing / inconsistent endpoints:** Frontend expects `/api/health` (and some other public endpoints) but backend does not expose the exact same path.
* **Reference representation ambiguity:** Many backend models (Mongoose) expect `ObjectId` for references (e.g., `patient`, `clinic`, `provider`) while frontend types allow `Patient | string`. If the frontend sometimes sends whole nested objects rather than IDs, Mongoose may accept them only if middleware transforms them; otherwise runtime errors occur.
* **Widespread `any` usage:** Both backend and frontend contain many `any` usages and ad-hoc typings in routes/services/components — this weakens type guarantees.
* **Validation mismatch:** Backend uses `express-validator` in routes; frontend performs lightweight checks in components (no consistent, shareable validation schema). This leads to duplicated validation logic and potential drift.
* **Error shape & status variance:** Backend returns various error shapes (sometimes `{ success:false, message }`, sometimes standard `res.status(...).json({})`), frontend expects `ApiResult` shape — enforcement is partial.

**Bottom line:** the shared `packages/types` is a major positive. The project will benefit significantly from (A) removing `any` hot-spots, (B) aligning routes/paths, and (C) sharing validation schemas (Zod/Joi) or generating a contract (OpenAPI/Swagger) that produces frontend types.

---

## 2) API Contract Mapping

> I extracted backend `routes/*` under `backend/src/routes` and frontend API requests from `src/services/apiService.ts`.

### Backend routes (summary)

I parsed the backend route files and aggregated route patterns (mounted under `/api` in `backend/src/app.ts`):

Examples (non-exhaustive; full list in repo):

* `GET  /api/appointments/providers/:providerId/availability` — `backend/src/routes/appointments.ts`
* `POST /api/appointments` — `backend/src/routes/appointments.ts`
* `POST /api/appointments/book` — `backend/src/routes/appointments.ts`
* `GET  /api/appointments` — `backend/src/routes/appointments.ts`
* `GET  /api/appointments/:id` — `backend/src/routes/appointments.ts`
* `PATCH /api/appointments/:id` — `backend/src/routes/appointments.ts`
* `GET  /api/admin/contacts` — `backend/src/routes/admin/contacts.ts`
* `GET  /api/admin/dashboard` — `backend/src/routes/admin/index.ts`
* `POST /api/auth/login` — `backend/src/routes/auth.ts`
* `POST /api/auth/register` — `backend/src/routes/auth.ts`
* `POST /api/auth/forgot-password` — `backend/src/routes/auth.ts`
* `POST /api/auth/reset-password` — `backend/src/routes/auth.ts`
* `POST /api/patient-auth/login` — `backend/src/routes/patientAuth.ts`
* `POST /api/patient-auth/register` — `backend/src/routes/patientAuth.ts`
* `POST /api/forms/submit` — `backend/src/routes/forms.ts`
* etc.

> **Files of interest:**
> `backend/src/routes/*.ts`, `backend/src/routes/admin/*.ts` — see repo for the full list.

---

### Frontend API calls (found in `src/services/apiService.ts`)

I extracted the endpoints called by the frontend service:

* `/api/admin/contacts`
* `/api/admin/contacts/batch-update`
* `/api/admin/contacts/duplicates`
* `/api/admin/contacts/merge`
* `/api/appointments`
* `/api/auth/forgot-password`
* `/api/auth/login`
* `/api/auth/me`
* `/api/auth/register`
* `/api/auth/reset-password`
* `/api/dashboard/stats`
* `/api/forms/responses`
* `/api/forms/submit`
* `/api/health`
* `/api/patient-auth/login`
* `/api/patient-auth/me`
* `/api/patient-auth/register`
* `/api/public/contact`

---

### Endpoint → Frontend vs Backend mapping (high-level)

| Frontend call                      |                                                                                    Backend route (found) | Issue                                                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------: | -------------------------------------------------------------------------------------------------------------- |
| `/api/admin/contacts`              |                                                     `GET /api/admin/contacts` (routes/admin/contacts.ts) | OK                                                                                                             |
| `/api/admin/contacts/batch-update` |                                                            `routes/admin/contacts.ts` contains batch ops | OK (check exact path & method)                                                                                 |
| `/api/appointments`                |                                                                     `routes/appointments.ts` (POST, GET) | OK — verify semantics & DTOs                                                                                   |
| `/api/auth/login`                  |                                                                           `routes/auth.ts` (POST /login) | OK                                                                                                             |
| `/api/auth/register`               |                                                                        `routes/auth.ts` (POST /register) | OK                                                                                                             |
| `/api/dashboard/stats`             |                                  **No** — backend exposes `/api/admin/dashboard` (routes/admin/index.ts) | **Mismatch (critical)** — frontend expects `/api/dashboard/stats` but backend provides `/api/admin/dashboard`. |
| `/api/health`                      | No dedicated `health` route found; app may have health checks in app.ts but no `/api/health` route found | **Missing** (frontend requests likely get 404)                                                                 |
| `/api/patient-auth/*`              |                                                                         `routes/patientAuth.ts` (exists) | OK (verify method & payload)                                                                                   |
| `/api/forms/submit`                |                                                                                 `routes/forms.ts` (POST) | OK                                                                                                             |

**Action:** fix path inconsistency `/api/dashboard/stats` → either change frontend to `/api/admin/dashboard` or add a new backend route at `/api/dashboard/stats` that proxies to same logic.

---

## 3) Type Alignment Verification (per important endpoints)

I'll show 4 representative endpoints (Auth register/login, Appointments POST, Admin contacts list, Forms submit) with backend types, frontend types and discrepancies. I reference the files I inspected.

> **Locations (examples):**

* Backend models / DTOs: `backend/src/models/*.ts`, `backend/src/services/*.ts`
* Backend routes: `backend/src/routes/*.ts` and `backend/src/routes/admin/*.ts`
* Shared types: `packages/types/src/index.ts`
* Frontend API calls: `src/services/apiService.ts`

---

### A — `POST /api/auth/register` (user registration)

* **Backend:** `backend/src/routes/auth.ts`

  * Uses express-validator in route to validate fields. The service is `backend/src/services/authService.ts`.
  * User model: `backend/src/models/User.ts` (mongoose schema). Many required fields exist there and DB-level constraints.
* **Shared type:** `packages/types/src/index.ts` has types like `RegisterRequest`, `User`.

  * In `apiService.ts` frontend imports `RegisterRequest`.
* **Frontend:** `src/services/apiService.ts` uses `RegisterRequest` from `../../packages/types/src/index`.
* **Discrepancies / risks:**

  * Backend requires certain fields (e.g., `email`, `password`, maybe `clinicId` in some flows). Ensure `RegisterRequest` marks required fields as required. If backend requires additional fields or deeper nested objects the front end doesn't supply, runtime failures will result.
  * Some backend fields may be constrained by database (unique email). That's OK — but ensure frontend validation provides friendly messages matching backend validation.
* **Files:**

  * Backend route: `backend/src/routes/auth.ts`
  * Backend service: `backend/src/services/authService.ts`
  * Shared types: `packages/types/src/index.ts` (look for `RegisterRequest`).
  * Frontend usage: `src/services/apiService.ts`, `src/pages/.../Register` components.

---

### B — `POST /api/appointments` (create appointment)

* **Backend:** `backend/src/routes/appointments.ts` and `backend/src/services/schedulingService.ts`

  * Mongoose model: `backend/src/models/Appointment.ts`. Schema uses `patient`, `clinic`, `provider`, `appointmentType` as `ObjectId` refs (required).
* **Shared type:** `packages/types/src/index.ts` contains:

  ```ts
  export type CreateAppointmentDTO = {
    patient: string | Patient;
    clinic: string | Clinic;
    provider: string | Provider;
    appointmentType: string | AppointmentType;
    scheduledStart: string | Date;
    scheduledEnd: string | Date;
    status: 'scheduled' | 'confirmed' | ...;
    ...
  };
  ```
* **Frontend:** `apiService.ts` uses `CreateAppointmentDTO`.
* **Discrepancies / risks:**

  * The shared type allows `patient: string | Patient`. If the frontend sends a full `Patient` object (instead of `patientId` string), Mongoose may error when saving (it expects an `ObjectId`) unless the backend service coerces to the `_id`. Best practice: **frontend should send IDs only** (or a normalized payload) and the shared type should prefer `string` for reference fields — or be explicit (`patientId: string` vs `patient?: Patient`).
  * There is potential mismatch in date serialisation: frontend may send ISO string; backend accepts `string | Date`. Confirm parsing in the service.
* **Files:**

  * Model: `backend/src/models/Appointment.ts`
  * Route: `backend/src/routes/appointments.ts`
  * Shared type: `packages/types/src/index.ts` (`CreateAppointmentDTO`, `Appointment`).
  * Frontend call: `src/services/apiService.ts` (appointment create method).

---

### C — `GET /api/admin/contacts` (contacts list)

* **Backend:** `backend/src/routes/admin/contacts.ts`

  * Accepts query params `page`, `limit`, `status`, `search`, `sortBy`, `sortOrder`. Backend uses `limit` as page size (note: package types changed `pageSize` → `limit`).
* **Shared type:** `packages/types` has `Pagination`:

  ```ts
  export type Pagination = {
    page?: number;
    limit?: number; // changed to match backend
    total: number;
    pages?: number;
  };
  ```
* **Frontend:** `apiService.ts` calls `/api/admin/contacts` and expects `ContactListResponse` etc from types package.
* **Discrepancies / risks:**

  * Good: the types package already uses `limit` instead of pageSize — it matches backend code. Confirm the frontend passes `limit` query param (it uses `apiService` to build queries).
* **Files:**

  * Backend route: `backend/src/routes/admin/contacts.ts`
  * Shared types: `packages/types/src/index.ts` (Pagination, ContactListResponse)
  * Frontend: `src/services/apiService.ts` and UI components under `src/components/Admin/Contacts/*`.

---

### D — `POST /api/forms/submit`

* **Backend:** `backend/src/routes/forms.ts`
* **Shared type:** likely `CreateFormResponse` / `FormSubmission` in `packages/types`
* **Frontend:** `src/services/apiService.ts` -> submit method uses `CreateFormResponse` from shared types
* **Discrepancies / risks:** confirm field names (e.g., `formId` vs `form_id`) and error format.

---

## 4) Type Usage Verification (traceability)

I traced imports of the shared `packages/types` across repo:

### Where `packages/types` is consumed

* **Backend** (imports `@topsmile/types` or local package path):

  * Models: `backend/src/models/{Appointment,AppointmentType,Clinic,Contact,Patient,Provider,User}.ts`
  * Services: `backend/src/services/{appointmentService,appointmentTypeService,authService,contactService,patientService,patientAuthService,providerService,schedulingService}.ts`
  * Middleware/tests: `backend/src/middleware/*`, `backend/tests/*`
* **Frontend:**

  * `src/services/apiService.ts` imports many types from `../../packages/types/src/index`
  * Components and hooks use the types indirectly via API service outputs (e.g., `ContactList`, `Patient` components)
* **Traceability table (examples):**

| Type (shared)                         |                                            Backend files that use it |                                                                                 Frontend files that use it | Issues found                                                                              |
| ------------------------------------- | -------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------- |
| `Appointment`, `CreateAppointmentDTO` | `backend/src/models/Appointment.ts`, `services/schedulingService.ts` |                                                                `src/services/apiService.ts`, patient pages | Ambiguity: `patient` field allows object or id; recommend use `patientId: string` in DTOs |
| `User`, `RegisterRequest`             |              `backend/src/models/User.ts`, `services/authService.ts` |                                                                   `src/services/apiService.ts`, auth pages | Validate required fields match `express-validator` rule sets                              |
| `Pagination`                          |                               `backend/src/routes/admin/contacts.ts` |                                                      `src/services/apiService.ts`, contact list components | Good (types already use `limit`)                                                          |
| `ApiResult<T>`                        |                                  used in frontend service interfaces | backend sometimes returns `{ success, data, message }` but occasionally returns errors of differing shapes | Normalize to `ApiResult` across backend routes                                            |

> **Note:** I found many files using `any` (backend and frontend). Example lists:
>
> * Backend files with `any` usage: `app.ts`, `middleware/*`, `models/*`, `routes/*`, `services/*`.
> * Frontend files: many components and tests include `any` casts or `: any`.

---

## 5) Security & Validation Alignment

* **Backend validation:** mostly `express-validator` in route files (e.g., `patientAuth.ts`, `appointments.ts`). Additional checks exist in services (e.g., verifying availability).
* **Frontend validation:** mostly ad-hoc, component-level checks (e.g., password equality, required fields). I could not find a unified validation library (no `zod`, `yup`, or `react-hook-form` usage across the codebase).
* **Mismatches / Risks:**

  * Duplicate validation logic across front & back increases the chance of drift. Backend is authoritative — but user experience will suffer if front-end missing checks cause pointless form submissions.
  * Some backend validators require formats or minimum length that the front-end does not enforce (e.g., JWT secret length is enforced for runtime). For form fields, ensure client-side validations match backend rules (same regex / rules).
* **Recommendation:** adopt a shared validation schema (Zod or similar) in `packages/types` and use it on both server and client (server can use `zod` for runtime validation or transform to express-validator). This eliminates duplication.

---

## 6) Error Handling Consistency

* **Current backend shapes** vary but often follow `{ success: boolean, data?, message?, errors? }`, which matches `ApiResult` in `packages/types`.
* **Inconsistencies found:**

  * Some routes respond with `res.status(404).json({ success: false, message: 'Not found' })` — OK — but some error handlers may return raw error objects.
  * Tests and frontend sometimes assume `res.data` exists when `ok` is false — code already handles this to some extent.
* **Recommendation:** Centralize error responses with middleware that ensures all errors return `ApiResult` shape. Example:

  ```ts
  // backend/src/middleware/normalizeResponse.ts
  function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Internal Server Error',
      errors: err.errors || []
    });
  }
  ```

  Then the frontend `request()` util can parse this reliably.

---

## 7) Roadmap — Optimal Type-Safe Integration

### Short-term fixes (0–2 weeks)

1. **Fix endpoint path mismatches** (critical):

   * Change frontend `/api/dashboard/stats` to `/api/admin/dashboard` **or** add a new backend route `/api/dashboard/stats` that proxies.
   * Add `/api/health` route or change frontend to expect existing health endpoint.
   * **Example patch** (frontend `src/services/apiService.ts`):

     ```diff
     --- a/src/services/apiService.ts
     +++ b/src/services/apiService.ts
     @@
     -  const res = await request(`/api/dashboard/stats`, { method: 'GET' });
     +  const res = await request(`/api/admin/dashboard`, { method: 'GET' });
     ```
   * (Full patch below in "Example diffs".)
2. **Enforce ID-only references in create/update DTOs** where backend expects `ObjectId`. Adjust shared `Create*DTO` types to use `patientId: string` etc, or at least prefer `string` for the required reference fields.
3. **Normalize the backend error response** via central error middleware so all responses match `ApiResult`.
4. **Remove trivial `any` usages** in critical services/routes (start with `auth`, `appointments`, `patients`).

### Medium-term improvements (2–8 weeks)

1. **Promote `packages/types` to a proper package** (already present) and ensure `backend` and `frontend` both import the built package via monorepo tooling (e.g., Yarn workspaces, npm workspaces or proper `paths`/`tsconfig` mapping). This ensures types resolve consistently and IDE autocompletion works reliably.
2. **Introduce runtime validation with Zod for DTOs** inside `packages/types` (or a sibling `packages/schemas`) and use the same schema on backend and frontend.

   * Backend: `zod` + a middleware to validate request bodies and respond with normalized error shape.
   * Frontend: `zod` for form parsing/validation or to generate typed form components.
3. **Generate OpenAPI (Swagger)** from backend controllers (or create OpenAPI spec), and generate a typed client for frontend (e.g., `openapi-generator` or `openapi-typescript` → maintain a generated `api-client`).
4. **Start `tsd` tests** in CI for critical public surfaces (e.g., ensure `apiService` returns typed `ApiResult<Appointment>`).

### Long-term architecture (8+ weeks)

1. **Contract-driven development:** adopt either:

   * OpenAPI YAML + generated clients + contract tests, or
   * tRPC or GraphQL code-first approach that gives end-to-end type guarantees.
2. **Automatic runtime validation & codegen:** use backend-first generation (OpenAPI) or schema-first (Zod) to derive DTOs, validators, and client code.
3. **Contract tests in CI:** run end-to-end contract tests that call backend dev containers or mocks to validate responses match generated types.

---

## 8) Testing Recommendations

* **Contract tests (priority):** Write tests that request each backend endpoint and compare response shape to the shared TypeScript type (using `io-ts` or `zod` assertions or runtime validators).
* **Type tests:** Use `tsd` to assert that exported types match expectations, for example:

  ```ts
  import { CreateAppointmentDTO } from '@topsmile/types';
  // tsd assertions here to assert fields exist and types are string
  ```
* **E2E + MSW:** For front-end tests use Cypress (or Playwright) and MSW to mock backend responses using the same `zod` validation rules used on the backend to ensure UI works with correct contract.
* **CI:** Fail CI if contract tests deviate.

---

## 9) Prioritized TODO list (Top 5)

1. **Fix path mismatches (High impact, Low effort)**

   * Update frontend `/api/dashboard/stats` → `/api/admin/dashboard` OR add a new backend route at `/api/dashboard/stats`.
   * **Why:** immediate 404s/blocking behaviors; small change avoids many runtime errors.
2. **Normalize backend error response with middleware (High impact, Low–Medium effort)**

   * Ensure every error goes through a single handler returning `ApiResult`.
   * **Why:** makes client handling predictable and testable.
3. **Make reference DTOs ID-first (Medium impact, Low effort)**

   * Replace `patient: string | Patient` with `patientId: string` in `CreateAppointmentDTO` (or at least make `patientId` canonical). Adjust client calls to send IDs.
   * **Why:** avoids ObjectId vs object transposition bugs.
4. **Adopt shared runtime validation (Medium impact, Medium effort)**

   * Add `zod` schemas in `packages/types` and use them in both backend and frontend.
   * **Why:** removes duplicated validation, ensures sync.
5. **Eliminate `any` in critical paths (auth, appointments, patients) (High impact, Medium effort)**

   * Start with backend `auth` and `appointments` services and frontend apiService/test code. Add stricter types and small type-cast removal PRs.

---

## Traceability Tables (examples)

### Endpoint → Backend type → Frontend type → Issue table (representative subset)

| Endpoint                              | Backend file (route/service/model)                                                             |          Shared type (packages/types) | Frontend file(s)                                                | Issue                                                                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------: | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `POST /api/auth/register`             | `backend/src/routes/auth.ts` → `services/authService.ts` → `models/User.ts`                    |             `RegisterRequest`, `User` | `src/services/apiService.ts`, `src/pages/Patient/Register/*`    | Ensure `RegisterRequest` required fields match `express-validator` rules; any `any` usage in service should be typed. |
| `POST /api/appointments`              | `backend/src/routes/appointments.ts`, `models/Appointment.ts`, `services/schedulingService.ts` | `CreateAppointmentDTO`, `Appointment` | `src/services/apiService.ts`, patient pages                     | `CreateAppointmentDTO` allows object or id; prefer `patientId: string`. Also confirm date serialisation.              |
| `GET /api/admin/contacts`             | `backend/src/routes/admin/contacts.ts`                                                         |   `ContactListResponse`, `Pagination` | `src/services/apiService.ts`, `src/components/Admin/Contacts/*` | Pagination naming matched (`limit`) — good. Validate query param building in frontend.                                |
| `GET /api/dashboard/stats` (frontend) | Backend has `GET /api/admin/dashboard` (`routes/admin/index.ts`)                               |            `DashboardStats` in types? | `src/services/apiService.ts`                                    | **Mismatch:** frontend path incorrect → 404                                                                           |

---

## Example diffs / patches (suggested)

> **1) Quick patch: change frontend dashboard endpoint**

* File: `src/services/apiService.ts`
* Replace the wrong path to the backend route. This is a minimal, focused fix.

```diff
*** a/src/services/apiService.ts
--- b/src/services/apiService.ts
@@
-// Dashboard stats (frontend expects /api/dashboard/stats)
-export async function getDashboardStats(): Promise<ApiResult<DashboardStats>> {
-  const res = await request(`/api/dashboard/stats`, {
-    method: 'GET'
-  });
-  return { success: res.ok, data: res.data, message: res.message };
-}
+// Dashboard stats — adjusted to backend admin path
+export async function getDashboardStats(): Promise<ApiResult<DashboardStats>> {
+  const res = await request(`/api/admin/dashboard`, {
+    method: 'GET'
+  });
+  return { success: res.ok, data: res.data, message: res.message };
+}
```

> **2) Suggestion: make CreateAppointmentDTO use `patientId`**

* File: `packages/types/src/index.ts` (edit type)

```diff
-export type CreateAppointmentDTO = {
-  patient: string | Patient;
-  clinic: string | Clinic;
-  provider: string | Provider;
-  appointmentType: string | AppointmentType;
+export type CreateAppointmentDTO = {
+  /** canonical foreign keys: prefer IDs for create/update operations */
+  patientId: string;
+  clinicId: string;
+  providerId: string;
+  appointmentTypeId: string;
   scheduledStart: string | Date;
   scheduledEnd: string | Date;
   status: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
   priority: 'routine' | 'urgent' | 'emergency';
   preferredContactMethod: 'phone' | 'email' | 'sms' | 'whatsapp';
   syncStatus: 'synced' | 'pending' | 'error';
   notes?: string;
   privateNotes?: string;
};
```

> **3) Normalise error middleware (backend)**

* File suggestion: `backend/src/middleware/errorHandler.ts` (create or update)

```ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || (err.array && err.array()) || [];
  res.status(status).json({
    success: false,
    message,
    errors
  });
}
```

---

## Assumptions (explicit)

1. **Assumption:** The backend TypeScript path mapping (or monorepo workspace) is configured so backend imports like `@topsmile/types` map to `packages/types`. I verified `packages/types/src/index.ts` is present and both backend and frontend refer to it; I assume `tsconfig` paths or workspace config make this work.
2. **Assumption:** The backend's Mongoose models expect `ObjectId` for refs; code does not automatically coerce nested objects into `_id` unless explicitly handled.
3. **Assumption:** The frontend `API_BASE_URL` is correctly set in environment; some dev-only endpoints might be different in deployment.

---

## Final checklist / immediate actions I recommend you merge ASAP

1. **Fix `/api/dashboard/stats` mismatch** (either frontend or backend) — highest-priority bug. See example diff above.
2. **Add `/api/health` route** if frontend expects it — or change front-end to whichever health endpoint exists.
3. **Make relationships ID-first** in DTOs (patientId, clinicId) in shared types and adapt backend services to accept IDs (or add robust coercion).
4. **Add central error middleware** to standardize `ApiResult` for errors.
5. **Introduce shared runtime schemas (Zod)** for the most used types (auth, appointment, patient, contact) and wire them to both backend and frontend.

---

## Roadmap timeline (concise)

* **Short-term (0–2 weeks)**

  * Fix route mismatches (`/api/dashboard/stats` etc.).
  * Normalize error responses.
  * Small PRs to remove `any` in critical authentication and appointment flows.

* **Medium-term (2–8 weeks)**

  * Introduce `zod` schemas in `packages/types` and use them on both sides.
  * Add `tsd` tests and contract tests.
  * Make `packages/types` a canonical workspace package.

* **Long-term (8+ weeks)**

  * Move to contract-driven generation (OpenAPI ↔ frontend types) or adopt tRPC if you want runtime typed RPC.
  * Full CI contract test harness that fails builds when types drift.

---

## Where I looked (high-level file paths)

* Local repo root: `/mnt/data/topsmile/topsmile-main`
* Backend: `backend/src/`

  * routes: `backend/src/routes/*.ts` and `backend/src/routes/admin/*.ts` (appointments, auth, patientAuth, admin/contacts, forms, providers, etc.)
  * models: `backend/src/models/*.ts` (Appointment.ts, Patient.ts, Contact.ts, Provider.ts, User.ts)
  * services: `backend/src/services/*.ts`
  * app: `backend/src/app.ts`
* Shared types: `packages/types/src/index.ts`
* Frontend: `src/services/apiService.ts`, `src/services/http.ts`, `src/pages/*`, `src/components/*`

---
