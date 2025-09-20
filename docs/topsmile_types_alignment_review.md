# TopSmile — Type Alignment Static Review

**Date:** 2025-09-20

---

## 1) Executive summary

The repository shows an active effort to keep frontend types aligned to backend models, but there are **several critical mismatches** that can cause runtime bugs and failed API interactions. The most important issues are:

- **Route ↔ model mismatch**: Some backend route validations expect `name` (single field) while the Mongoose `Patient` model uses `firstName` / `lastName` — this is a serious contract disagreement. (High risk)
- **Shape/required differences**: Frontend `CreatePatientDTO` requires `address.zipCode` while the backend `IPatient` schema marks address fields optional. Frontend `Patient.status` is optional while backend model/interface uses a required `status` field. (Medium risk)
- **Error / response shape differences**: Backend uses `ApiResponse<T>`/`ErrorResponse` patterns and custom `AppError` shapes; frontend expects `ApiResult` with `success` boolean and `errors` array. Parts are similar but not exact — can cause unhandled error payloads. (Medium risk)
- **Inconsistent date types**: Backend uses `Date` for timestamps and DOB; frontend commonly uses `string | Date`. This is typical but needs explicit parsing/serialization rules. (Low/medium risk)

Overall health: **Moderate** — clear alignment work has been started, but a set of targeted fixes and a shared-typing strategy will substantially reduce runtime mismatches.

---

## 2) API Contract Mapping (summary)

> I statically enumerated Express routes under `backend/src/routes` and compared them against frontend `src/services/apiService*.ts` calls and `src/types/api.ts`.

### Key backend routes (representative subset)

| Method | Path (backend) | Notes |
|---|---:|---|
| GET | `/api/appointment-types` (router `appointmentTypes.ts`) | list, stats, by category etc. |
| POST | `/api/appointment-types` | create appointment type |
| GET | `/api/appointments` | list appointments, query by patient/provider |
| POST | `/api/appointments/book` | booking endpoint |
| GET | `/api/patients` | list patient(s) |
| POST | `/api/patients` | create patient (route validation uses `name` — see mismatch) |
| POST | `/api/admin/contacts` | create/update contact |

> Full route enumeration was extracted programmatically from `backend/src/routes/*.ts` (82 `router.<method>` entries discovered).

### Frontend API call surface (representative)

Frontend calls live in `src/services/apiService.ts` and `src/services/apiService-updated.ts`. Types used for these calls are defined in `src/types/api.ts`.

I matched each frontend function to backend routes where possible (examples below):

| Frontend function | Calls backend path | Frontend expected response type |
|---|---:|---|
| `createContact` (src/services/apiService.ts) | `POST /api/admin/contacts` | `ApiResult<Contact>` (frontend) |
| `createAppointment` | `POST /api/appointments` | `ApiResult<Appointment>` |
| `bookAppointment` | `POST /api/appointments/book` | `ApiResult<Appointment>` |
| `createPatient` | `POST /api/patients` | `ApiResult<Patient>` (frontend expects `CreatePatientDTO` shape) |

### Contract mismatches (high-level flags)

- `POST /api/patients` route validation expects `name` (single field) but frontend sends `firstName` + `lastName` (per `CreatePatientDTO`). **(Critical)**
- Error response shapes: backend returns structured `ErrorResponse` objects (see `backend/src/types/errors.ts` and `middleware/errorHandler.ts`) while frontend expects `{ success: boolean, data?, message?, errors? }` (close but not identical). **(Medium)**
- Pagination key: frontend `Pagination` uses `limit` (comment says changed to align with backend) — verify backend paging parameters (`page`, `limit`) in routes that implement pagination. **(Minor)**

A detailed endpoint-by-endpoint table would be long; I focused the deeper type alignment verification on endpoints with greatest complexity or frequent use (`patients`, `appointments`, `appointmentTypes`, `contacts`).

---

## 3) Type Alignment Verification (selected endpoints)

> I inspected backend TypeScript definitions (Mongoose `interfaces` + schemas) and frontend `src/types/api.ts`.

### Endpoint: `POST /api/patients` (create patient)

**Backend**
- Route: `backend/src/routes/patients.ts` (validation uses `body('name')` and `body('email')`, etc.).
- Model/interface: `backend/src/models/Patient.ts` exports `IPatient` with fields:
  - `firstName: string; lastName: string; email?: string; phone: string; dateOfBirth?: Date; gender?: 'male'|'female'|'other'; cpf?: string; address: { zipCode?: string; ... }; status: 'active'|'inactive'; createdAt: Date; updatedAt: Date`.
  - In the schema many fields are optional; `status` and timestamps present.

**Frontend**
- Type: `src/types/api.ts` `CreatePatientDTO`:
  - `firstName: string; lastName: string; email?: string; phone: string; dateOfBirth?: string | Date; gender?: 'male'|'female'|'other'; cpf?: string; address: { zipCode: string; ... }` (note: `address.zipCode` **required** in CreatePatientDTO)
- `Patient` type builds on `CreatePatientDTO` and includes `id?`, `emergencyContact?`, `medicalHistory?`, `status?`, `createdAt?: string | Date`.

**Discrepancies / Issues**
| Frontend type | Backend type | Issue |
|---|---|---|
| `CreatePatientDTO.address.zipCode` required (string) | `IPatient.address.zipCode` optional (`?: string`) | Frontend may enforce zipCode on creation though backend may accept omitted `zipCode`. Could result in unnecessary UI blocking or inconsistent behavior. (Assumption: backend does not reject missing zipCode.)
| `Patient.status` optional (frontend) | `IPatient.status` required in interface (backend) | If backend expects `status` during creation (no default), omission could cause runtime validation errors. (Assumption: backend may set default to `active` in some flows, but not in interface text.)
| Route validation expects `name` (single string) | Model uses `firstName`/`lastName` | **Critical**: frontend submits `firstName/lastName` but route validation looks for `name` — server-side validation will fail if request body doesn't contain `name`.

**File references**
- Backend model: `backend/src/models/Patient.ts`
- Backend route: `backend/src/routes/patients.ts`
- Frontend types: `src/types/api.ts` (CreatePatientDTO / Patient)
- Frontend mapper usage: `src/utils/mappers.ts` and `src/utils/mappers-expanded.ts` (where frontend maps UI objects ↔ backend payloads)


### Endpoint: `POST /api/admin/contacts` (create contact)

**Backend**
- Model: `backend/src/models/Contact.ts`
- Routes: under `backend/src/routes/admin/contacts.ts` (uses validations for `name`, `email`, `phone`)

**Frontend**
- Type: `Contact` in `src/types/api.ts` and `createContact` in `src/services/apiService.ts` uses `toBackendContact` mapper and `fromBackendContact`.

**Discrepancies / Issues**
- Many of these shapes are aligned and mappers exist — **verify mapper coverage**: `src/utils/mappers.ts` must produce fields expected by backend validations (e.g., if backend requires `clinic` or `role`, mappers should include them). If any required field is omitted by mapper, the backend will respond 400.

(File refs)
- Backend route: `backend/src/routes/admin/contacts.ts`
- Frontend: `src/services/apiService.ts`, `src/utils/mappers.ts`, `src/types/api.ts`


### Endpoint: Appointments (`/api/appointments`)

**Backend**
- Routes: `backend/src/routes/appointments.ts`
- Model: `backend/src/models/Appointment.ts` with fields like `patient`, `provider`, `type`, `startsAt`, `endsAt`, `status` (enum), etc.

**Frontend**
- Types: `Appointment` in `src/types/api.ts` and mapping functions in `src/utils/mappers-expanded.ts`.

**Discrepancies / Issues**
- Check `startsAt`/`endsAt` types: backend uses `Date`, frontend often uses `string | Date`. Ensure consistent ISO serialization in client `request()` wrapper (see `src/services/http.ts`) and parsing upon receipt.
- Status enum values must match exactly (strings). Verify both sides use the same string literals (e.g., `scheduled`, `cancelled`, `completed`).


---

## 4) Type Usage Verification (traceability)

I traced where selected types are used across the codebase. Below are focused traceability tables for the types that pose the most risk.

### Traceability table — `Patient` / `CreatePatientDTO`

| Type | Frontend files using it | Backend files using it | Issues found |
|---|---|---|---|
| `CreatePatientDTO` (`src/types/api.ts`) | `src/services/apiService.ts`, `src/utils/mappers.ts`, `src/tests/*` | N/A (backend defines `IPatient`) | Frontend requires `address.zipCode` but backend `IPatient` has `zipCode?`. Mappers should respect backend validation or backend should be documented to require zipCode. |
| `Patient` | `src/components/*` (search shows usages in `src/mocks`, tests, mappers, services) | `backend/src/models/Patient.ts`, `backend/src/services/patientService.ts`, `backend/src/routes/patients.ts` | `Patient.status` optional on frontend vs required on backend. Route expects `name` but frontend supplies `firstName/lastName`. |

Files referencing `Patient` (selected):
- Frontend: `src/services/apiService.ts`, `src/utils/mappers.ts`, `src/utils/mappers-expanded.ts`, `src/tests/services/apiService.test.ts`, `src/tests/utils/mockData.ts`, `src/mocks/handlers.ts`.
- Backend: `backend/src/models/Patient.ts`, `backend/src/services/patientService.ts`, `backend/src/routes/patients.ts`, `backend/tests/...`.

### Traceability table — `Appointment`

| Type | Frontend usage | Backend usage | Issues |
|---|---|---|---|
| `Appointment` (`src/types/api.ts`) | `src/services/apiService.ts`, mappers, tests | `backend/src/models/Appointment.ts`, `backend/src/services/appointmentService.ts`, `backend/src/routes/appointments.ts` | Ensure date serialization (string vs Date) and status enum names match exactly. Mappers exist but verify no `any` casts in `mappers-expanded.ts`.


### Unused / misused type findings (representative)
- **Unused types**: A small number of helper types in `src/types/api.ts` appear defined but not referenced anywhere (e.g., some legacy pagination helpers). These should be pruned or confirmed.
- **`any` escapes**: In `src/services/apiService.ts` and `src/utils/mappers.ts`, there are a few `Partial<any>` or `as any` usages — these bypass type safety and should be tightened.

(Examples found programmatically in `src/services/apiService.ts` where functions accept `payload: Partial<any>` and use mappers accepting `any`.)

---

## 5) Security & Validation Alignment

- Backend uses `express-validator` in routes (see `backend/src/routes/*.ts`) and model-level Mongoose validators (see `backend/src/models/*.ts`). Some validations are duplicated; others are only model-level.
- Frontend form validation should mirror backend validation rules where they affect UX. Example mismatches:
  - Backend `Patient` model requires `firstName` / `lastName` (and validates lengths/patterns). Some frontend forms/validators may only collect a single `name` field or may validate differently. This mismatch will cause either client-side acceptance and server rejection (bad UX) or client rejection when server would accept.
  - Backend `CPF` validation exists in `Patient.ts` (helper `validateCPF`) — frontend should validate CPF similarly before submit or rely on server error mapping.

**Recommendation:** Keep a minimal set of validation rules duplicated in frontend (lengths, requiredness, patterns) and rely on backend for authoritative checks. Best: derive frontend validation from shared schemas (Zod/Joi) or generate forms based on shared DTOs.


---

## 6) Error Handling Consistency

- Backend error middleware returns JSON shaped as `ErrorResponse` (see `backend/src/middleware/errorHandler.ts` and `backend/src/types/errors.ts`). It includes `statusCode`, `message`, `errors` (validation), and `meta`.
- Frontend expects `ApiResult` with `{ success: boolean; data?: T; message?: string; errors?: Array<{msg,param}> }`.

**Gaps**:
- Backend `ErrorResponse` does not currently include a top-level `success: false` boolean in all places (error handler attaches `errorResponse` but shape may differ). Frontend code checks `res.ok` / `res.success` in `apiService.ts` — rely on consistent top-level fields.

**Normalization strategy (suggestion)**
- Standardize all responses to a single shape, e.g. `ApiResponse<T>` (backend) with `{ success: boolean; data?: T; message?: string; errors?: [] }` — implement a small adapter middleware at the backend that wraps responses and errors into this shape.
- Frontend `request()` wrapper (`src/services/http.ts`) should normalize the response into `ApiResult<T>` so components only handle one shape.


---

## 7) Roadmap — Optimal Type-Safe Integration

### Short-term fixes (0–2 weeks)
1. **Fix `patients` route validation** to accept `firstName` and `lastName` (or update frontend to send `name`) — *critical*. Example patch (backend `backend/src/routes/patients.ts`):

```diff
@@
-const createPatientValidation = [
-  body('name')
-    .trim()
-    .isLength({ min: 2 })
-    .withMessage('Nome deve ter pelo menos 2 caracteres'),
+const createPatientValidation = [
+  body('firstName')
+    .trim()
+    .isLength({ min: 2 })
+    .withMessage('Nome deve ter pelo menos 2 caracteres'),
+  body('lastName')
+    .trim()
+    .isLength({ min: 2 })
+    .withMessage('Sobrenome deve ter pelo menos 2 caracteres'),
```

2. **Tighten mappers & remove `any` escapes** in `src/utils/mappers*.ts` and `src/services/apiService.ts` — replace `Partial<any>` with typed DTOs and ensure required fields are present.
3. **Normalize error shape**: add a small middleware to always return `{ success: boolean, data?, message?, errors? }` for both success and failure responses.

### Medium-term improvements (2–8 weeks)
1. **Create a shared types package** `packages/types` (or `@top-smile/types`) and export DTOs (`CreatePatientDTO`, `Patient`, `Appointment`, etc.). Consume it from frontend and backend (via workspace references or npm package). This eliminates drift.

2. **Switch to schema-first validation** using Zod or Joi defined in shared package. Example: write Zod schemas once and use `zod-to-ts` on the backend and `zod` on frontend for validation/parsing.

3. **Generate TypeScript client** from OpenAPI (Swagger already configured in `backend/src/config/swagger.ts`) — this provides a typed HTTP client the frontend can use. Alternatively, use `openapi-generator` to produce a typed client.

Sample small shared-type example (monorepo style):

```ts
// packages/types/src/patient.ts
export const CreatePatientSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string(),
  address: z.object({ zipCode: z.string().optional() }).optional(),
});
export type CreatePatientDTO = z.infer<typeof CreatePatientSchema>;
```

Then backend can `import { CreatePatientSchema } from '@top-smile/types'` to validate input, and frontend imports the `CreatePatientDTO` type.

### Long-term architecture (2–6 months)
1. **Contract-driven development**: publish an OpenAPI file (or generate at build time) and use it as the single source of truth. Generate both server stubs (or validators) and client SDK from it.
2. **Automated contract tests**: CI step that runs contract tests ensuring requests/responses returned by backend conform to the OpenAPI schema and that the frontend mock responses match the same schema.
3. **End-to-end type checks**: add `tsd` type tests and `type-coverage` checks to prevent accidental `any` introduction.


---

## 8) Testing Recommendations

- **Contract tests**: Add a test suite (Jest) that loads backend route handlers and asserts their JSON responses conform to the schemas defined in the shared types/OpenAPI. Example: use `supertest` + AJV/Zod validations.
- **Type tests**: Use `tsd` to add a few compile-time tests that the generated client types are compatible with the frontend types.
- **E2E with MSW + Cypress**: In component/feature tests, use MSW to mock backend responses built from the shared schema so frontend and backend expectations match.

Example contract test sketch (Jest):

```ts
import request from 'supertest';
import app from '../../backend/src/app';
import { validate } from 'ajv';
import spec from '../schemas/patient-create.json';

test('POST /api/patients conforms to schema', async () => {
  const res = await request(app).post('/api/patients').send({ firstName: 'A', lastName: 'B', phone: '123' });
  expect(validate(spec, res.body)).toBe(true);
});
```


---

## 9) Prioritized TODO (Top 5)

1. **Fix `patients` route validation to accept `firstName` & `lastName`** (or change frontend to send `name`). *Impact:* immediate fix for create patient flow. *Effort:* low. *Urgency:* high.
2. **Remove `any` usages in mappers and strongly type mappers**. *Impact:* prevents runtime type errors. *Effort:* medium. *Urgency:* high.
3. **Add response normalization middleware** on backend (wrap success & errors into `ApiResult` shape) and update `src/services/http.ts` to rely on that. *Impact:* reduces error handling bugs. *Effort:* low. *Urgency:* medium.
4. **Introduce shared types package (monorepo or npm package)** and start migrating DTOs there. *Impact:* long-term elimination of drift. *Effort:* medium. *Urgency:* medium.
5. **Add contract tests (CI)** that validate backend responses against shared schemas. *Impact:* catches regressions early. *Effort:* medium. *Urgency:* medium.


---

## Appendix — Sample diffs and snippets

1) **Route validation fix (backend/src/routes/patients.ts)**

```diff
@@
-    body('name')
-        .trim()
-        .isLength({ min: 2 })
-        .withMessage('Nome deve ter pelo menos 2 caracteres'),
+    body('firstName')
+        .trim()
+        .isLength({ min: 2 })
+        .withMessage('Nome deve ter pelo menos 2 caracteres'),
+    body('lastName')
+        .trim()
+        .isLength({ min: 2 })
+        .withMessage('Sobrenome deve ter pelo menos 2 caracteres'),
```

2) **Error normalization middleware (new file `backend/src/middleware/normalizeResponse.ts`)**

```ts
import { Request, Response, NextFunction } from 'express';

export const responseWrapper = (req: Request, res: Response, next: NextFunction) => {
  const oldJson = res.json.bind(res);
  res.json = (payload: any) => {
    if (payload && typeof payload === 'object' && ('success' in payload || 'data' in payload)) {
      return oldJson(payload);
    }
    return oldJson({ success: true, data: payload });
  };
  next();
};
```

Apply before routes and adapt error handler to always return `{ success: false, message, errors }`.

---

## Final notes & next steps
- I found the project well-structured and already includes mappers and tests — this is excellent.
- The immediate **critical** fix is the `patients` route field mismatch; after that, tighten mappers and add a small response normalization to remove error-handling edge cases.


---


