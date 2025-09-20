# TopSmile — Frontend ↔ Backend Type Alignment Report

*(static analysis only — no code executed beyond reading repository files you provided)*

**Repo examined:** `/mnt/data/topsmile-main/topsmile-main` (backend in `backend/src`, frontend in `src`)
**Scan scope:** backend route files (`backend/src/routes/*`), backend models (`backend/src/models/*.ts`), backend types (`backend/src/types/*.ts`), backend error/validation middleware; frontend API client and types (`src/services/*.ts`, `src/types/api.ts`, `src/pages/*`), selected mappers and form pages.
**Assumptions:**

* Where controllers are not separate, route files contain the handler logic or call service functions (assumption).
* Backend mounts routes under `/api/*` as shown in `backend/src/app.ts`.
* The frontend client uses `src/services/apiService.ts` (there is also an `apiService-updated.ts` present).
* I focused on the most important, frequently-used domain types: `User`, `Patient`, `Appointment`, `Provider`, contact/forms and shared error shapes. I did not inspect generated/third-party code.

---

# 1 — Executive summary

The overall **type alignment is reasonably good** for common, high-level entities (User, Appointment, Provider) — the frontend already contains a `src/types/api.ts` that was updated to mirror many backend fields. URL paths used by the frontend map to backend-mounted routes (`/api/...`) and the frontend `apiService.ts` mostly uses the same endpoints.

**Critical risks discovered:**

* **Required/optional mismatches** (backend requires some fields the frontend treats as optional) — the highest risk is the `Patient` model: backend expects `phone` and `address` (non-optional in the interface/schema) while the frontend marks them optional. This leads to potential server validation errors or runtime 400s.
* **Error response shape mismatch**: backend uses `{ success: false, message: string, errors?: string[] }` but frontend expects `errors?: Array<{msg, param}>` inside `ApiResult`. This will cause the frontend to mis-handle errors such as validation failures.
* **Validation mismatch**: backend enforces stricter input rules (express-validator + model-level validators for CPF, phone formats, zip formatting, min/max lengths) while frontend form code uses only HTML `required` attributes or lightweight checks. This can produce surprising server-side rejections.
* **Optionality and type shape differences** for appointments and other nested objects — frontend often makes many fields optional while backend marks some of them required (e.g., scheduledStart/End may be required at creation).

Overall: *no catastrophic mismatch in route names/paths*, but **type optionality and error shapes** need alignment to avoid runtime errors and poor UX.

---

# 2 — API Contract Mapping (summary + mismatches)

Below I list the most important backend-mounted route groups (from `backend/src/app.ts` and `backend/src/routes/*`) and map frontend calls to them (extracted from `src/services/apiService.ts`). I then flag mismatches.

> Note: The repository mounts many sub-routers. I list the key groups and then show a sample of frontend-used endpoints mapped to backend mount prefixes.

## Backend-mounted route prefixes (sample)

These prefixes are mounted in `backend/src/app.ts` (exact mount points taken from the file):

* `/api/auth` (auth, login, register)
* `/api/patient-auth` (patient-specific auth)
* `/api/contact` (public contact form, contact admin)
* `/api/patients`
* `/api/appointments`
* `/api/appointment-types`
* `/api/providers`
* `/api/admin` (admin endpoints)
* `/api/forms`
* `/api/public` (public endpoints)
* `/api/docs` (swagger)

## Frontend endpoints used (sample, from `src/services/apiService.ts`)

(These are the paths requested by the frontend code; all start with `/api/...`)

* `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/forgot-password`
* `/api/patient-auth/register`, `/api/patient-auth/me`, etc.
* `/api/patients` (create / update / list)
* `/api/appointments` (create / list / update)
* `/api/providers` (list / one)
* `/api/public/contact` (public contact form)
* `/api/admin/contacts`, `/api/admin/contacts/batch-update`

All these are present as backend route mounts (no missing routes).

---

## MISMATCH TABLE — high-impact examples

| Endpoint                         |                                                               Frontend expected type (brief) | Backend type (brief)                                                                                                                                                            | Issue / Risk                                                                                                                   |                                     |                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- | ----------------------------------------------------- |
| `POST /api/patients`             |      `Patient` (`phone?: string`, `address?: {...}`) — frontend often sends `phone` optional | Backend `IPatient` declares `phone: string` and `address: { ... }` (non-optional) and contains validators for CPF & phone formats (`validateBrazilianPhone`)                    | **Required vs optional**: server may reject requests missing `phone`/`address` (400). UX problem & runtime errors.             |                                     |                                                       |
| `GET /api/patients/:id`          |                                                  returns `Patient` with \`birthDate?: string | Date`, `cpf?: string`, `address?:\` ...                                                                                                                                         | Backend `IPatient` types `birthDate?: Date`, `cpf?: string`, `address` present.                                                | Minor: Type narrowing around \`Date | string`is OK. But frontend must parse`Date\` strings. |
| `POST /api/auth/login`           | frontend expects `ApiResult<{ user: User, token?: string }>` with `success` boolean & `data` | Backend returns `SuccessResponse` `{ success: true, data: {...}, meta? }` on success; on error returns `ErrorResponse` `{ success: false, message: string, errors?: string[] }` | **Error shape mismatch**: frontend expects `errors` as array of `{msg,param}`; backend returns `string[]`. Need normalization. |                                     |                                                       |
| `POST /api/appointments`         |                 frontend `Appointment` often allows optional `scheduledStart`/`scheduledEnd` | Backend `IAppointment` requires `scheduledStart`, `scheduledEnd`, `patient`, `provider`, `appointmentType`, `clinic` and other fields.                                          | **Required/optional mismatch** — missing required fields will make backend validation throw.                                   |                                     |                                                       |
| Any endpoint (validation errors) |                                     frontend expects `ApiResult.errors?: Array<{msg,param}>` | backend `ErrorResponse.errors?: string[]` (or sometimes express-validator format may be present but code tends to normalize to `string[]`)                                      | **Frontend can't display per-field messages properly** (no `param`), causing poor UX and error parsing logic to fail.          |                                     |                                                       |

> The table above contains the most pressing mismatches. I focused on `Patient` and `Appointment` because those are high-volume flows in the app.

---

# 3 — Type Alignment Verification (per endpoint — examples)

Below I provide **for each example endpoint**: backend type (relevant DTO/Mongoose model), frontend type, file references, and discrepancies.

> I sampled the most important endpoints. For full coverage run a script that compares the complete set of DTO properties.

---

### Endpoint: `POST /api/patients` (create patient)

* **Backend (model / docs)**

  * File: `backend/src/models/Patient.ts`
  * Interface: `IPatient`
  * Key excerpt (backend required properties):

    ```ts
    export interface IPatient extends Document {
      name: string;
      email?: string;
      phone: string;                      // required in interface
      birthDate?: Date;
      gender?: 'male'|'female'|'other';
      cpf?: string;
      address: {                          // defined without ?, so expected
        street?: string;
        number?: string;
        complement?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        zipCode?: string;
      };
      // other fields...
    }
    ```
  * Validation: Model contains Brazilian phone and CPF validations (helper functions inside model); route `backend/src/routes/patients.ts` also uses `express-validator` rules (see `createPatientValidation`) for `name`, `phone`, `email`, `cpf` and more.

* **Frontend**

  * File: `src/types/api.ts` — `export type Patient = { ... }`
  * Key excerpt:

    ```ts
    export type Patient = {
      id?: string;
      _id?: string;
      name: string;
      email?: string;
      phone?: string;   // optional
      birthDate?: string | Date;
      gender?: 'male' | 'female' | 'other';
      cpf?: string;
      address?: {       // optional
        street?: string;
        number?: string;
        neighbourhood?: string;
        city?: string;
        state?: string;
        zipCode?: string;
      };
      // ...
    }
    ```

* **Discrepancies / Risk**

  * `phone` is **required** in backend (`IPatient.phone: string`) but **optional** on frontend. If frontend omits `phone`, backend may return 400/validation error.
  * `address` is required-ish in backend (interface shows `address: {...}` not `address?:`), but frontend marks `address?:` optional. The repo’s routes/model include normalization code for zip; backend likely expects `address` in some form.
  * **Fix**: Make frontend require `phone` and at least minimal `address` fields on forms that create patients (or backend should relax if truly optional). Add client-side CPF/phone formatting/validation matching the server.

---

### Endpoint: `POST /api/auth/login` (authentication)

* **Backend**

  * File: `backend/src/routes/auth.ts` and `backend/src/services/authService.ts`
  * Response on success: `SuccessResponse<T>` where `SuccessResponse` is `{ success: true, data?: T, message?: string, meta?: { } }`
  * Error: `ErrorResponse` is `{ success: false, message: string, errors?: string[] }` (see `backend/src/types/errors.ts`)

* **Frontend**

  * File: `src/services/apiService.ts` + `src/types/api.ts` `ApiResult<T>`
  * `ApiResult<T>`:

    ```ts
    export type ApiResult<T = any> = {
      success: boolean;
      data?: T;
      message?: string;
      errors?: Array<{ msg: string; param: string }>;
    };
    ```

* **Discrepancies / Risk**

  * Backend `ErrorResponse.errors` is `string[]` while frontend expects array of `{msg,param}` (common express-validator format). When backend returns `string[]`, the frontend code that reads `errors[0].msg` will break or show `undefined`.
  * **Fix**: Standardize error shape. E.g. have backend return `errors?: Array<{msg:string,param?:string}>` consistently, or adapt frontend to handle both shapes.

---

### Endpoint: `POST /api/appointments`

* **Backend**

  * File: `backend/src/models/Appointment.ts` (`IAppointment`) — required fields: `patient`, `clinic`, `provider`, `appointmentType`, `scheduledStart`, `scheduledEnd`, `status`, `priority`, `preferredContactMethod`, `syncStatus` ... (see file for full list)
  * `routes/appointments.ts` uses `express-validator` on creation endpoints.

* **Frontend**

  * File: `src/types/api.ts` `Appointment` type — many fields are optional (e.g., `scheduledStart?`, `scheduledEnd?`, `status?`, `priority?`), and `patient` may be `string | Patient` union.

* **Discrepancies / Risk**

  * Frontend allowing `scheduledStart`/`scheduledEnd` to be optional may cause backend validation errors if those fields are required during create. Also union types (`patient: string | Patient`) are fine, but the frontend must ensure it sends the `patient` as the backend expects (usually an ID).
  * **Fix**: Frontend should enforce required creation payload fields (strict `CreateAppointmentPayload`) and map internal `Appointment` UI model to server DTO via mapping functions (mappers exist in repo — ensure they enforce required fields).

---

### Error shape & metadata

* **Backend `ErrorResponse`** (`backend/src/types/errors.ts`):

  ```ts
  interface ErrorResponse {
    success: false;
    message: string;
    errors?: string[];
    meta?: { timestamp: string; requestId?: string; }
  }
  ```
* **Frontend `ApiResult`** expects `errors?: Array<{msg,param}>` (from `src/types/api.ts`).

**Impact:** frontend UI code that renders field-level messages or mapping to forms will break or not show useful validation messages.

---

# 4 — Security & Validation Alignment

* **Backend validation**

  * Uses **express-validator** in route files (e.g., `routes/patients.ts` contains `createPatientValidation` rules).
  * Model-level validation exists in Mongoose schemas (CPF, phone, email format, length restrictions).
  * Error responses are normalized by `errorHandler` middleware to an `ErrorResponse`.

* **Frontend validation**

  * Mostly basic: HTML `required` attributes, simple JS checks in pages like `PatientRegisterPage.tsx` and `src/pages/Login/RegisterPage.tsx`.
  * No centralized form validation library (e.g., Zod/Yup) used across the app; some client-side validation uses minimal checks (e.g., confirmPassword match).
  * **Mismatch:** backend rejects inputs by format (CPF, phone, zip) that frontend does not fully validate. This causes friction and poor UX (user types something that looks fine, gets rejected server-side with a generic `string[]` message).

**Recommendation (security/validation alignment)**

* Add shared validation rules or a shared validator schema (Zod or Yup) used in frontend forms and server. Two options:

  1. **Shared schemas** via a `@top-smile/types` package (see roadmap) that contains Zod schemas; backend uses them for request parsing + validation, frontend can reuse same schema for form validation.
  2. If not possible, export a JSON schema/OpenAPI and generate client validators or use the same validation regex/constants in a small shared package.

---

# 5 — Error Handling Consistency

* **Backend**: `SuccessResponse` / `ErrorResponse` union in `backend/src/types/errors.ts`. On server errors `errorHandler` returns `{ success:false, message, errors?: string[] }`. Validation middleware may attach arrays of messages.
* **Frontend**: `ApiResult<T>` expects `errors?: Array<{msg: string, param: string}>`; code likely expects `errors[0].msg` for display.

**Problems**

* Inconsistent `errors` type; also `errors` content may be strings or objects. `ApiResult` fields `data` vs backend `data` are compatible but front-end code that expects field-level `param` will fail.

**Normalization strategy**

* **Server-side (preferred)**: On validation failures, always return:

  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": [
      { "param": "email", "msg": "Email is invalid" },
      { "param": "phone", "msg": "Phone is required" }
    ],
    "meta": { ... }
  }
  ```

  i.e., use `{ param,msg }` objects. Implement a small helper in `errorHandler` to convert `string[]` into `{msg: string}` objects to ensure frontend gets a consistent shape.
* **Frontend (quick patch)**: Make error parsing tolerant — accept both shapes:

  ```ts
  const errors = result.errors?.map(e => typeof e === 'string' ? { msg: e, param: '' } : e);
  ```

  But that’s only a band-aid.

---

# 6 — Roadmap — Optimal Type-Safe Integration

Below are short, medium and long term recommendations with code snippets and example diffs where useful.

## Short-term fixes (quick wins — low/medium effort)

1. **Normalize error response shapes on the backend**

   * Update `backend/src/middleware/errorHandler.ts` to convert `string[]` errors to `{ msg, param? }` objects before sending.
   * *Example patch (backend)*:

     ```diff
     --- a/backend/src/middleware/errorHandler.ts
     +++ b/backend/src/middleware/errorHandler.ts
     @@
     -  const errorResponse = {
     -    success: false,
     -    message: error.message || 'Internal Server Error',
     -    errors: (error as any).errors || undefined,
     -    meta: {
     -      timestamp: new Date().toISOString(),
     -      requestId: (req as any).requestId
     -    }
     -  };
     +  const rawErrors = (error as any).errors;
     +  const normalizedErrors = Array.isArray(rawErrors)
     +    ? rawErrors.map((e: any) => typeof e === 'string' ? { msg: e } : e)
     +    : undefined;
     +
     +  const errorResponse = {
     +    success: false,
     +    message: error.message || 'Internal Server Error',
     +    errors: normalizedErrors,
     +    meta: {
     +      timestamp: new Date().toISOString(),
     +      requestId: (req as any).requestId
     +    }
     +  };
     ```
   * **Benefit:** frontend consumes consistent `errors` structure.

2. **Make critical backend-required fields explicit on frontend forms**

   * Update `src/types/api.ts` so that the `Patient` creation payload type uses required `phone` & `address.street|zipCode` fields or, better, create a `CreatePatientDTO` type used by `apiService.ts` for requests.
   * *Example patch (frontend)*:

     ```diff
     -export type Patient = {
     -  id?: string;
     -  _id?: string;
     -  name: string;
     -  email?: string;
     -  phone?: string;
     +export type CreatePatientDTO = {
     +  name: string;
     +  email?: string;
     +  phone: string; // required according to backend
     +  cpf?: string;
     +  address: { zipCode: string; street?: string; city?: string; };
     +}
     ```
   * Update `apiService.ts` to accept `CreatePatientDTO` for `createPatient()`.

3. **Frontend: tolerant error parsing** (short)

   * In `src/services/http.ts` (or central response handler), add tolerant parsing:

     ```ts
     function normalizeErrors(errors:any){
       if (!errors) return undefined;
       return errors.map((e:any) => typeof e === 'string' ? { msg: e, param: '' } : e);
     }
     // use when returning ApiResult
     ```

## Medium-term improvements (months — moderate effort)

1. **Create a shared `@top-smile/types` package** (monorepo or npm package) — export TS interfaces + Zod schemas:

   * Files to include:

     * `types/User.ts` (`IUser` interface + `userSchema` Zod)
     * `types/Patient.ts` (`CreatePatientDTO`, `PatientResponse` + zod)
     * `types/Appointment.ts` ...
   * Use this package in both backend and frontend:

     * Backend uses Zod schemas for request validation & parsing.
     * Frontend reuses Zod schemas for form validation and type generation (`z.infer<typeof patientSchema>`).
   * **Benefit:** single source of truth reduces drift.

2. **Generate client types from the backend (OpenAPI)**:

   * Add an OpenAPI spec generator in the backend (use `express-openapi-generator` or JSDoc with comments, or prefer swagger-jsdoc + a build step).
   * Use `openapi-typescript` or `openapi-generator` to generate a typed TS client; or use `openapi-typescript-codegen` to generate typed fetch/axios client.
   * **Alternative (if using Zod):** use `zod-to-json-schema` + `openapi` or `zod-to-ts` patterns.

3. **Add DTO-specific types (create vs response)**:

   * Differentiate `CreatePatientDTO` vs `PatientResponse` vs internal `PatientModel`.
   * Frontend `apiService` should accept `CreatePatientDTO` not full `Patient` UI type.

## Long-term architecture (6–12 months)

1. **Adopt contract-driven development**:

   * Define API via **OpenAPI** (or tRPC/GraphQL if you prefer end-to-end typed RPC) and use the spec to generate:

     * server request/response types (TypeScript)
     * client SDK (TypeScript) — no manual API call strings
     * integration tests (contract tests)
   * **Alternative**: move to **tRPC** if you want zero-REST overhead and full type-safety (backend and frontend share types natively). This is a larger rewrite.

2. **Automate type checks / CI gating**:

   * Add a CI job to fail when `@top-smile/types` used in frontend diverges from backend API (e.g., run `tsc` for both, contract tests).
   * Run automated contract tests (Pact or e2e tests that validate responses against generated JSON schemas).

---

# 7 — Testing Recommendations

* **Automated contract tests**:

  * Use **Pact** or **Pactflow** to define consumer contracts on the frontend and verify provider on the backend. This ensures breaking changes are caught.
  * Alternatively generate **OpenAPI** schema and use a test that calls the running backend and validates responses against OpenAPI (e.g., `jest-openapi`).

* **Type-level tests**:

  * Add `tsd` tests to assert shape invariants: e.g., that `z.infer<typeof backendPatientSchema>` is assignable to `frontend` `Patient` types. Place these tests in a separate `types` test job.

* **Integration tests**:

  * E2E (Cypress) using **MSW** (Mock Service Worker) with mocks generated from backend schemas. MSW handlers should be generated from the shared schema (OpenAPI or zod) to always match server behavior.
  * Add supertest-based tests on backend to ensure request validators produce the `ErrorResponse` shape and required fields cause `400`.

* **Unit tests for mappers**:

  * The repo already contains mapping utilities (`src/utils/mappers*`). Add unit tests that verify mapping from frontend UI models to backend DTOs and back.

---

# 8 — Prioritized TODO List (Top 5 actions)

1. **Normalize backend error shape** (Impact: High | Effort: Low | Urgency: Immediate)

   * Implement consistent `errors: Array<{msg:string,param?:string}>` in `errorHandler`. Update `express-validator` error formatting there. This removes a major mismatch.

2. **Make backend-required fields required in frontend DTOs and forms** (Impact: High | Effort: Low-Medium | Urgency: Immediate)

   * Update `src/types/api.ts` to define `CreatePatientDTO` and `CreateAppointmentDTO` with fields required by backend. Update `apiService` function signatures to accept these DTOs. Update forms (e.g., Patient Register) to require `phone` and `address.zipCode`.

3. **Introduce a shared types package (monorepo or npm)** (Impact: Very High | Effort: Medium | Urgency: Short-term)

   * Create `packages/types` with Zod schemas + TS interfaces. Import in both backend & frontend.

4. **Add contract tests in CI** (Impact: High | Effort: Medium | Urgency: Short-term)

   * Add a job that runs a contract test (Pact/OpenAPI verification) to ensure endpoints and DTOs stay in sync.

5. **Add client generation from OpenAPI or Zod** (Impact: High | Effort: Medium-High | Urgency: Medium-term)

   * Generate typed client library for the frontend and use it instead of hand-coded path strings.

---

# Appendix — Example snippets & diffs

### A. Example backend error normalization (see short-term fix)

```diff
--- a/backend/src/middleware/errorHandler.ts
+++ b/backend/src/middleware/errorHandler.ts
@@
-  const errorResponse = {
-    success: false,
-    message: error.message || 'Internal Server Error',
-    errors: (error as any).errors || undefined,
-    meta: {
-      timestamp: new Date().toISOString(),
-      requestId: (req as any).requestId // Assuming requestId is attached to req
-    }
-  };
+  const rawErrors = (error as any).errors;
+  const normalizedErrors = Array.isArray(rawErrors)
+    ? rawErrors.map((e: any) => typeof e === 'string' ? { msg: e } : e)
+    : undefined;
+
+  const errorResponse = {
+    success: false,
+    message: error.message || 'Internal Server Error',
+    errors: normalizedErrors,
+    meta: {
+      timestamp: new Date().toISOString(),
+      requestId: (req as any).requestId
+    }
+  };
```

### B. Example frontend DTO creation for Patient (`src/types/api.ts`)

```diff
-export type Patient = {
-  id?: string;
-  _id?: string;
-  name: string;
-  email?: string;
-  phone?: string;
-  ...
-}
+export type CreatePatientDTO = {
+  name: string;
+  email?: string;
+  phone: string; // required - backend expects phone
+  cpf?: string;
+  birthDate?: string | Date;
+  gender?: 'male'|'female'|'other';
+  address: {
+    zipCode: string; // at least zip required
+    street?: string;
+    number?: string;
+    neighborhood?: string;
+    city?: string;
+    state?: string;
+  };
+}
+
+export type Patient = CreatePatientDTO & {
+  id?: string;
+  _id?: string;
+  status?: 'active'|'inactive';
+  createdAt?: string|Date;
+  updatedAt?: string|Date;
+}
```

### C. Example zod-based shared validation (concept)

```ts
// packages/types/patient.ts (shared)
import { z } from "zod";

export const CreatePatientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  cpf: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(['male','female','other']).optional(),
  address: z.object({
    zipCode: z.string().min(8),
    street: z.string().optional(),
    number: z.string().optional()
  })
});
export type CreatePatientDTO = z.infer<typeof CreatePatientSchema>;
```

* Backend uses `CreatePatientSchema.parse(req.body)` to validate.
* Frontend uses `CreatePatientSchema` to validate forms (via `react-hook-form` + zod resolver or manual).

---

# Final checklist & short timeline

## Short-term (0–2 weeks)

* [ ] Normalize backend `errors` shape and update `errorHandler` (Immediate).
* [ ] Update frontend `src/types/api.ts` to add explicit `Create*DTO` types for `Patient` and `Appointment`.
* [ ] Update `apiService.createPatient` and forms to use `CreatePatientDTO` and enforce required fields.
* [ ] Add tolerant error parsing to frontend response handler.

## Medium-term (1–3 months)

* [ ] Extract shared `@top-smile/types` package with zod schemas and TS types.
* [ ] Use shared schemas in backend validation and frontend forms.
* [ ] Add contract tests (Pact or OpenAPI based) in CI.

## Long-term (3–12 months)

* [ ] Migrate to contract-driven flow (OpenAPI auto-generation OR tRPC) and generate typed clients.
* [ ] Add automated compatibility checks in CI (type-level tests + contract tests).

---

# Closing notes & next steps

I inspected the code in the repository you provided and produced the above findings and prioritized plan. The main immediate action to remove frequent runtime surprises is to **standardize error responses** and **align critical required fields** between the frontend DTOs and backend models (particularly `Patient` and `Appointment`). After that, creating a small shared types package (Zod + TS) will pay dividends and let you enforce validation on both sides with minimal drift.

If you want, I can now (choose one):

* produce a **concrete patch/diff** for the backend `errorHandler` and frontend `CreatePatientDTO` + `apiService` changes (I can generate git-style diffs in the next message), **or**
* generate a starter `packages/types` layout with Zod schemas for `Patient`, `User`, `Appointment` (skeleton code) that you can copy into a monorepo, **or**
* produce a script (Node/TS) that enumerates all endpoint payloads and automatically compares shape keys between `src/types/api.ts` and `backend/src/models/*.ts` (to produce a full mismatches CSV).

Pick which you'd like and I will supply the concrete code/diffs immediately.
