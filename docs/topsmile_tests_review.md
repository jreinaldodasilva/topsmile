# TopSmile — Static Review of **Testing setup and test code**

> Deliverable: full static analysis + prioritized TODOs + examples + run instructions.
> Scope: repository `/mnt/data/topsmile-main.zip` (static only — I did not run any tests or start services).
> Assumptions I had to make are explicitly marked below.

---

## Executive summary (TL;DR)

* **Backend**: Jest + `ts-jest` is configured and used. Tests exist and use **MongoDB Memory Server** correctly (see `backend/tests/setup.ts`). Coverage artifacts are present (`backend/coverage`). `jest.config.js` looks appropriate for a TypeScript/Node test environment. There are unit and integration tests targeting services (e.g., `schedulingService`) and test helpers to build DB fixtures.
* **Frontend**: React app uses Create-React-App style test setup. `src/setupTests.ts` configures **MSW** for tests and includes polyfills. Many component/unit tests exist and helper utilities & mocks are present.
* **MSW**: Handlers and server are defined (`src/mocks/*`). There is a `__mocks__` folder with Jest mocks for MSW for environments where you prefer to stub it.
* **Cypress (E2E)**: Cypress test files exist in `cypress/e2e/*.cy.js` (login, appointment, error\_handling). **BUT** there is **no top-level Cypress configuration** (`cypress.json` or `cypress.config.ts`) in the repo root; tests call `cy.visit('/login')` which means `baseUrl` must be configured to run reliably.
* **Gaps & risks**:

  * Missing/unclear Cypress config (important: `baseUrl`, viewport, env, dev server start).
  * Some MSW handlers / mocks may not cover the full backend route surface; ensure alignment with backend endpoints and DTOs.
  * Some tests assume i18n strings (Portuguese) — brittle if copy changes.
  * CI config for tests not present (no `.github/workflows/*`), or not visible — be cautious on CI integration (services, ports, environment).
  * Small likelihood of ESM vs CJS friction (faker v8 is handled in tests by dynamic import, but note transformIgnore rules in Jest).

---

## What I inspected (files / locations)

* Root: `package.json`, `tsconfig.json`
* Backend: `backend/jest.config.js`, `backend/tsconfig.json`, `backend/package.json`, `backend/tests/*` (including `setup.ts`, `testHelpers.ts`, unit tests like `schedulingService.test.ts`), `backend/src/*` (models, services, middleware, routes), `backend/coverage/*`.
* Frontend: `src/setupTests.ts`, `src/jest-pre-setup.ts`, `src/__mocks__/*`, `src/mocks/*` (MSW handlers & server), `src/tests/*` (utils and tests), `src/App.test.tsx`.
* Cypress: `cypress/e2e/*.cy.js`.
* Note: I did **not** execute code, import packages, or start servers.

---

# 1) Test Infrastructure Review

### Backend (Jest + ts-jest)

**What’s present**

* `backend/jest.config.js` with:

  * `preset: 'ts-jest'`
  * `testEnvironment: 'node'`
  * `roots: ['<rootDir>/src', '<rootDir>/tests']`
  * `transform` with `ts-jest`
  * `transformIgnorePatterns` adjusted to allow `supertest` and `@faker-js/faker`
  * `setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']` — good; `setup.ts` starts MongoMemoryServer and sets JWT secret
  * `collectCoverageFrom` and `coverageReporters` configured
  * `testTimeout: 30000`, `detectOpenHandles: true`, `forceExit: true`, reporters including `jest-junit`

**Notes / Recommendations**

* `forceExit: true` hides open-handle issues — consider removing `forceExit` and relying on `detectOpenHandles` to identify hanging async operations. Use `--runInBand` in CI for debugging if tests hang.
* `transformIgnorePatterns` explicitly whitelists `supertest` and faker — good. If other ESM deps are added, they may need whitelisting too.
* Jest coverage is already generated (coverage folder present) — check `collectCoverageFrom` excludes (e.g., `src/config/**`) — ensure those excludes are intentional.

### Frontend (Create-React-App/Jest + RTL + MSW)

**What’s present**

* `src/setupTests.ts` loads polyfills and `@testing-library/jest-dom`, then sets up MSW server via `require('./mocks/server').server`. It uses `beforeAll`, `afterEach`, `afterAll`.
* `src/mocks/server.ts` exports `setupServer(...handlers)`.
* `src/mocks/handlers.ts` contains many `http.*` handler definitions that mock API endpoints used by the frontend.
* `src/__mocks__/msw.ts` and `src/__mocks__/server.ts` exist (useful if you want Jest to replace actual MSW during some runs).

**Notes / Recommendations**

* The code uses the `msw` *edge/http* style (i.e., `http.post`, `HttpResponse.json`). Ensure you have the correct msw version installed (`msw@1.x` adds `http` util). If project runs with `msw@0.x`, the code will fail. Verify package.json msw version.
* `setupTests.ts` uses `require('./mocks/server').server` (CJS `require`) — this is fine for CRA/Jest, but keep consistent module style.

### MSW alignment & mocks

* MSW handlers implement many endpoints (`/api/auth/login`, `/api/appointments`, `/api/dashboard/stats`, `/api/admin/contacts`, etc.). They provide a good baseline for frontend tests.
* **Risk**: handlers are long but may not cover all backend routes (the backend has many routes — e.g., `/providers/:providerId/availability`, `/responses`, `/templates`). You must keep the handlers in sync with backend routes/DTOs when API changes.

### Cypress

**What's missing**

* There is **no top-level Cypress config** (I could not find `cypress.json` or `cypress.config.ts`). The repository contains `cypress/e2e/*.cy.js` tests but these tests call `cy.visit('/login')` — that requires a `baseUrl` in Cypress config or `--config baseUrl=...` at runtime.
* No `cypress/support` or `cypress/plugins` setup files visible (these can still be present in `cypress/` — I found only `e2e` folder). That may be OK but check for consistent support file behavior.

**Recommendation**

* Add `cypress.config.ts` (Cypress v10+) or `cypress.json` (older) with `e2e` config including `baseUrl`, `viewportWidth/Height` defaults, `env` (for test users), and `setupNodeEvents` if you need network mocking.
* If you use MSW in Cypress, you may prefer to use `cy.intercept()` or integrate MSW in the application (e.g., start MSW in the app or use `setupWorker` in test mode). Document the approach.

---

# 2) Backend Testing — static audit & recommendations

### What I found

* Tests exist in `backend/tests` and `backend/tests/unit/...`:

  * `tests/setup.ts` uses `mongodb-memory-server` and cleans DB between tests — **correct pattern** for isolation.
  * Unit tests for `schedulingService` exist and create DB fixtures via `testHelpers`.
  * `testHelpers.ts` centralizes creation of test users/clinics/patients — good for DRY tests.
  * `customMatchers.ts` adds useful domain-specific matchers.

### Specific checks

* **MongoDB Memory Server** is used and started in `tests/setup.ts`. The code sets `process.env.JWT_SECRET` for tests. Collections are cleaned in `afterEach`. Good.
* **Authentication**:

  * Tests create users and set JWT env — verify that auth middleware is included in integration tests which exercise protected routes.
* **Appointment overlap logic**:

  * There is a `schedulingService.test.ts`. It appears to create providers, appointment types, and patients, and exercise booking/rescheduling flows. This indicates overlap logic is tested.
* **Validation**:

  * I did not find explicit tests for all validation branches (e.g., invalid DTOs, malformed dates, timezone edge cases). Some tests check happy path and some error paths; expand tests for more branches.

### Coverage gaps (static identification)

* Services are tested (e.g., `schedulingService`) — but **controller**/route-level integration tests are minimal or missing: specifically:

  * Tests calling the Express routes with `supertest` and asserting HTTP status and payload for edge error conditions (400, 401, 409) should be present.
* **Concurrency / Race conditions**:

  * No tests that simulate concurrent booking attempts for the same slot to assert that overlap prevention holds under parallel requests. Consider a test that triggers parallel booking attempts (use `Promise.all`) against the service layer and assert only one persists.
* **Edge/timezone cases**:

  * Appointment calculations in `utils/time.ts` (or scheduling logic) should be tested for DST transitions and timezone boundaries.
* **Performance/regression**:

  * No perf tests (but acceptable). For regression, ensure critical business logic has high coverage (scheduling, availability, payment flow, token blacklisting).

### Suggested additional backend tests

* **Controller integration tests using `supertest`**:

  * `POST /api/appointments` — test missing fields (400), invalid times (400), overlapping appointment (409), successful creation (201), created resource shape.
  * `PATCH /api/appointments/:id/reschedule` — test reschedule into an overlapping slot, and valid reschedule.
* **Concurrency test**:

  * Simulate two near-simultaneous calls to `schedulingService.createAppointment()` for the same provider/time — verify only one is created.
* **Auth / token blacklist**:

  * Tests that exercise login, token creation, token blacklist insert/check (e.g., logout then attempt a protected route with the blacklisted token should fail).
* **Validation boundary tests**:

  * Appointment durations: 0 minutes, negative duration, extremely long durations.
  * Provider working hours: appointment at the exact start or end of working hours — is it allowed?
* **Error handling**:

  * Simulate DB disconnection (close mongoose connection) and assert that endpoints return 503 or a meaningful error (middleware `database.ts` exists — ensure tests for that).

---

# 3) Frontend Testing — audit & recommendations

### What I found

* `src/setupTests.ts` configures MSW and RTL (`@testing-library/jest-dom`) — correct.
* Many unit/integration tests exist in `src/tests/*` and `src/__tests__/*` (e.g., `apiService.test.ts`, `paymentService.test.ts`, many component tests).
* Test utilities exist: `src/tests/utils/test-utils.tsx`, `apiMocks.ts`, `mockData.ts`, `testHelpers.tsx` — strong, consistent test helpers.

### MSW alignment

* `src/mocks/handlers.ts` contains many endpoints and shapes returned in `data` fields. Example endpoints mocked: `/api/auth/login`, `/api/appointments`, `/api/dashboard/stats`, `/api/admin/contacts`.
* **Potential mismatch**: The backend has many more route variants (see list in repo). Ensure:

  * **Paths** and **response DTO shapes** in handlers match backend.
  * **Auth behavior** (401/403) are simulated where appropriate.
* **Internationalization**: Some frontend tests assert text seen by users (e.g., error messages in Portuguese). This makes tests brittle if copy changes. Use `data-*` selectors to assert behavior rather than exact text where possible.

### Coverage gaps & suggested tests

* **User flows to add**:

  * Complete login → book appointment → see appointment in calendar flow (RTL integration test with MSW mock for each backend call).
  * Error handling states: server returns 500 during booking; UI shows retry option.
  * Loading states: ensure spinners shown while calls pending, and that disabled buttons re-enable on finish.
  * Form validation: field-level errors shown after blur, and blocked submit when invalid.
* **Selectors & robustness**:

  * Use accessible selectors: roles, labels, placeholders, and preferably `data-testid` or `data-cy` attributes for critical elements. Avoid relying on class names or full text.
* **Component boundary tests**:

  * Calendar interactions: navigate months, select a slot, interaction with provider availability.
  * Dashboard widgets: stats loading, fallback when empty data/graph data absent.

---

# 4) End-to-End (Cypress) — static analysis

### What exists

* `cypress/e2e/login.cy.js`
* `cypress/e2e/appointment.cy.js`
* `cypress/e2e/error_handling.cy.js`

These cover basic flows: login form, booking flow, error handling.

### Missing / problematic items

* No **Cypress config** (`baseUrl` missing), so `cy.visit('/login')` will fail unless tests are executed with CLI `--config baseUrl=http://localhost:3000`.
* No `cypress/support/index.js` or custom commands — it's acceptable but useful to have login command and app bootstrapping.
* **Mobile responsiveness** tests are missing (run test with different viewports).
* **Deep linking** (e.g., direct link to appointment detail requiring auth + redirect) not present.
* **Network error recovery**: tests that simulate flaky network or server 500 with `cy.intercept` responses, to verify UI recovery and retry options.
* **Accessibility checks**: Consider adding `cypress-axe` runs in E2E.

### Recommendations

* Add `cypress.config.ts` with:

  * `baseUrl` default (e.g., `http://localhost:3000`).
  * `viewportWidth/Height` defaults and possibly `retries` for CI.
  * `setupNodeEvents` for custom logging or screenshot/video config for CI.
* Add `cypress/support/commands.js` with `cy.login()` (set token in localStorage or via UI) to speed up tests.
* Add tests for:

  * Mobile viewport flows.
  * Deep linking + redirect back to resource after login.
  * Recovering from API failures (use `cy.intercept` to mock 500).

---

# 5) Code quality in tests (patterns & refactor opportunities)

### Strengths

* Centralized `testHelpers` and `customMatchers` on backend — improves readability and reduces duplicate fixture code.
* Frontend test utilities (test-utils wrapper, `apiMocks`) are present.
* MSW usage for frontend tests reduces reliance on a running backend — good practice.

### Issues / brittle patterns

* **Hard-coded copy assertions** (Portuguese strings): brittle if copy changes. Prefer queries by role/label or `data-testid` + asserting presence of key fragment rather than full string.
* **Using `forceExit` in Jest** may mask open-handle bugs.
* **Missing custom async utilities** to wait for stable UI states — ensure consistent usage of `await findBy*` instead of `getBy*` when waiting for async content.
* **Selectors**: some Cypress tests use `data-cy` which is good; ensure consistent adoption across components.

### Refactor suggestions

* Backend:

  * Add `dbTestUtils` with `clearDatabase`, `createFixture`, `loginTestUser` helpers.
* Frontend:

  * Add unified `renderWithProviders` wrapper (includes Redux/React Query/Router) if not already in `test-utils.tsx`.
  * Create `msw` handlers split by domain (authHandlers, appointmentsHandlers) and a `composeHandlers()` helper so tests can reuse and override easily.
* Tests async handling:

  * Prefer `await screen.findByText` / `findByRole` for elements that appear after async calls.
  * Use `waitFor` only when necessary; avoid arbitrary `sleep`/timeouts.

---

# 6) Prioritized Plan for Improvements (actionable TODOs)

### Top 5 fixes (priority + rationale)

1. **Add Cypress configuration** (`cypress.config.ts`) and support files.

   * *Why*: E2E tests currently assume a `baseUrl` and environment. Without config, CI/local runs will be flaky.
2. **Ensure MSW handler coverage and DTO alignment with backend routes**.

   * *Why*: Frontend unit/integration tests depend on handlers. If API contracts drift, tests will become false-positive/false-negative.
3. **Add / strengthen controller-level integration tests with `supertest`** (backend).

   * *Why*: Unit tests for services exist, but controller/route handlers need tests for HTTP semantics (status codes, input validation).
4. **Remove `forceExit` from backend Jest config and fix any open-handle issues**.

   * *Why*: Masking open handles risks flaky tests in CI; rely on `detectOpenHandles` to fix root causes.
5. **Add concurrency tests for scheduling to guard against race conditions**.

   * *Why*: Critical business logic; race conditions could cause double bookings.

### Secondary tasks

* Add tests for timezone/DST edge cases.
* Add Cypress mobile viewport & deep-link tests.
* Consolidate test selectors and avoid hard text assertions; use `data-testid` or accessible queries.
* Add CI workflow for running unit, integration, and E2E tests with proper services (e.g., `npm run test` back-end, `npm run test` front-end, start app, run Cypress).

---

# 7) Example code snippets to illustrate improvements

> These are static examples. Adapt names to your codebase. They are ready to be dropped into the repo after minor path adjustments.

## A. `cypress.config.ts` (recommended)

```ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // update as needed
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/index.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 8000,
    retries: {
      runMode: 2,
      openMode: 0
    },
    setupNodeEvents(on, config) {
      // add event hooks if necessary (screenshots, video, custom logging)
      return config;
    },
  },
});
```

## B. Cypress `cypress/support/commands.js` quick login helper

```js
Cypress.Commands.add('login', (email = 'admin@topsmile.com', password = 'SecurePass123!') => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login', // uses baseUrl from config
    body: { email, password },
    failOnStatusCode: false
  }).then((resp) => {
    // adjust to the shape of your login response
    const token = resp.body?.data?.accessToken;
    if (token) {
      window.localStorage.setItem('topsmile_token', token);
    }
  });
});
```

## C. Example backend integration test for appointment creation (supertest)

```ts
// backend/tests/integration/appointments.integration.test.ts
import request from 'supertest';
import { app } from '../../src/app'; // adjust export to supply app
import { createTestUser, createTestClinic } from '../testHelpers';

describe('Appointments API', () => {
  let token: string;
  beforeAll(async () => {
    const clinic = await createTestClinic();
    const user = await createTestUser({ clinic: clinic._id, email: 'inttest@topsmile.com' });
    // generate JWT via authService or login endpoint (prefer login flow)
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'inttest@topsmile.com', password: 'TestPassword123!' });
    token = res.body?.data?.accessToken;
  });

  it('returns 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({}); // missing required fields
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('creates appointment when valid', async () => {
    const payload = {
      patientId: 'somePatientId',
      providerId: 'someProviderId',
      start: new Date().toISOString(),
      duration: 30,
    };
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
  });
});
```

## D. Example frontend React Testing Library test (calendar booking flow)

```tsx
// src/tests/integration/calendarBooking.test.tsx
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import App from '../../App';
import { rest } from 'msw';
import { server } from '../../mocks/server';

test('user books an appointment via calendar flow', async () => {
  renderWithProviders(<App />);

  // navigate to login
  userEvent.click(screen.getByRole('link', { name: /login/i }));
  userEvent.type(screen.getByLabelText(/email/i), 'admin@topsmile.com');
  userEvent.type(screen.getByLabelText(/password/i), 'SecurePass123!');
  userEvent.click(screen.getByRole('button', { name: /login/i }));

  // wait for dashboard to load
  await screen.findByRole('heading', { name: /dashboard/i });

  // navigate to booking
  userEvent.click(screen.getByRole('link', { name: /book appointment/i }));

  // pick a slot (test-utils can provide helpers to find slots by text or testid)
  userEvent.click(await screen.findByTestId('slot-2025-10-01-10:00'));

  // mock the appointment creation server response to ensure success
  server.use(
    rest.post('*/api/appointments', (req, res, ctx) => {
      return res(ctx.status(201), ctx.json({ success: true, data: { _id: 'appt-1', ...req.body } }));
    })
  );

  userEvent.click(screen.getByRole('button', { name: /confirm booking/i }));

  // assert result
  const successMsg = await screen.findByText(/agendado com sucesso|Booking confirmed/i);
  expect(successMsg).toBeInTheDocument();
});
```

---

# 8) How to run tests locally (execution plan & env notes)

> These steps are static instructions. Adjust `npm` vs `pnpm`/`yarn` as needed.

### 1) Prerequisites

* Node.js (recommended LTS — check `engines` in `package.json` if present).
* npm (same).
* MongoDB not required locally for backend unit tests (MongoMemoryServer used), but ensure your dev env has enough memory for the in-memory server.
* Ensure environment variables: create `.env.test` or set them in CI. Tests rely on at least:

  * `JWT_SECRET` (set in `backend/tests/setup.ts` when missing, but other env like `SMTP_*` may be referenced by service startup — consider stubbing or setting safe defaults).
* Install dependencies:

  * `npm install` at repo root (frontend dependencies are in root package.json — repo appears to be single package Create-React-App with backend in `backend/`).

### 2) Backend unit & integration tests

From `backend/`:

```bash
cd backend
npm ci           # or npm install
npm test         # runs `jest` per package.json script
# To get coverage:
npm run test:coverage
```

Notes:

* If tests rely on TypeScript builds, `ts-jest` will transpile. Ensure `tsconfig.json` includes `tests` patterns as needed.
* If you see hanging tests, remove `forceExit: true` from `jest.config.js` and run `jest --detectOpenHandles --runInBand` to find where.

### 3) Frontend tests (React Testing Library)

From project root:

```bash
npm ci
npm run test     # CRA test runner; will start interactive watch by default
# To run once in CI:
CI=true npm run test -- --watchAll=false
```

Notes:

* `src/setupTests.ts` will auto-run MSW server before tests; ensure `msw` version matches handlers code style.

### 4) Cypress E2E

1. Start the app (dev server), usually:

   ```bash
   # either in repo root:
   npm run dev
   # or start backend & frontend separately:
   cd backend && npm run dev   # runs ts-node server
   cd (root) && npm run start  # start CRA at :3000
   ```
2. Open Cypress:

   ```bash
   npx cypress open
   # or run headless in CI
   npx cypress run --config baseUrl=http://localhost:3000
   ```

**Important**: Because there is no `cypress.config.ts` in the repo:

* Pass `--config baseUrl=http://localhost:3000` OR add `cypress.config.ts` as in the example above.
* In CI, start the app in a job step, wait for the URL to be ready, then run `npx cypress run`.

### 5) Test DB & env

* Backend tests use `mongodb-memory-server` so no external DB is needed.
* For integration/E2E that call the real backend, you will want a separate test DB or use a staging DB; guard any destructive tests.
* For MSW-based frontend tests, no backend running is required.

---

# 9) CI/CD considerations & potential pitfalls

* Ensure CI job installs dev dependencies (e.g., `mongodb-memory-server` may fetch binaries and require network access).
* If you add `cypress run` to CI, you must:

  * Start the frontend server (and backend server if Cypress hits real APIs).
  * Ensure the job waits until `http://localhost:3000` responds (use `wait-on` or similar).
* Code coverage: backend uses `jest-junit` and `lcov`; configure CI to collect and publish reports.
* If `msw` versions differ between dev and CI, tests might fail. Pin MSW version in `package.json`.
* Beware `forceExit: true` on Jest: can mask leaks that will cause CI flakiness. Remove and fix leaks if CI hangs.
* If you plan to run Cypress in parallel, ensure unique test accounts or reset DB per spec.

---

# 10) Coverage gaps & regression risks (summary)

* **Controller/route level**: Medium risk — add more integration tests (supertest) to verify HTTP contracts and validation behavior.
* **Scheduling concurrency**: High risk — double bookings possible if race conditions exist. Add concurrency and integration tests.
* **MSW / contract drift**: Medium risk — if backend changes, frontend tests may not detect mismatches because handler shapes may be outdated. Add contract tests or extend MSW handlers to use shared DTO definitions if possible (or have a contract testing step).
* **E2E environment**: High risk — lack of a Cypress config and missing CI orchestration will cause flaky or failing E2E runs.

---

# 11) Prioritized full TODO list (actionable)

### Immediate (day-1 to day-3)

1. **Add `cypress.config.ts`** to repo and a `cypress/support/index.js` + `commands.js` with `cy.login`. Update tests to use `cy.login()` where applicable.
2. **Remove `forceExit: true`** from `backend/jest.config.js`. Run tests locally with `--runInBand` + `--detectOpenHandles` to identify and fix leaks.
3. **Audit and sync MSW handlers** with backend routes & DTOs. Create a short mapping doc `tests/msw-endpoints.md`.
4. **Add controller integration tests** (supertest) for key endpoints: `auth`, `appointments`, `providers/availability`.
5. **Add concurrency test** for `schedulingService` that fires two booking attempts simultaneously to assert single booking acceptance.

### Short term (week 1)

6. Add tests for timezone/DST edge cases in scheduling utils.
7. Replace brittle text assertions with role/label/testid-based assertions across frontend tests.
8. Add Cypress tests for mobile/viewport responsiveness and deep-linking flows.

### Medium term (weeks 2–4)

9. Add CI configuration (GitHub Actions / GitLab CI) with separate jobs: `install`, `backend tests`, `frontend tests`, `start app`, `cypress run`.
10. Add contract tests / API schema validation between backend and frontend (optional: use OpenAPI and a contract test runner or pact-like approach).

---

## 12) Assumptions I had to make (explicit)

* I assumed the frontend is served at `http://localhost:3000` by CRA (`npm start`) — update `baseUrl` if different.
* I assumed backend exports an Express `app` to allow `supertest(app)` usage (common pattern). If not, you may adapt by starting the server in test setup and calling its address instead.
* I assumed `msw` package version supports the `http` API used in `src/mocks/handlers.ts`. If the project uses a different msw variant, adapt handlers to `rest` or `graphql` handlers as appropriate.
* I did not run any tests; all findings are from static file inspection only.

---

## 13) Final notes & quick checklist to get test suite into robust state

* [ ] Add `cypress.config.ts` (set `baseUrl`, support file).
* [ ] Run backend tests locally without `forceExit` to identify leaks.
* [ ] Create `backend/tests/integration/*` for controller-level behavior (use `supertest`).
* [ ] Add concurrency test(s) for scheduling.
* [ ] Audit and sync MSW handler list with backend routes; create categorized handlers for reusability.
* [ ] Replace fragile string assertions with queries by role/testid/accessibility.
* [ ] Add CI workflow that:

  * installs deps
  * runs `npm run test` for both backend and frontend
  * starts app and runs `npx cypress run` for E2E
* [ ] Pin versions for `msw`, `mongodb-memory-server`, and critical dev deps to avoid environment drift.

---

If you’d like, I can:

* produce a **patch** with the recommended `cypress.config.ts`, `cypress/support/commands.js`, and a sample `backend/tests/integration/appointments.integration.test.ts` placed into the repo (ready to review), **or**
* create a short **MSW-to-route mapping document** listing which backend routes are covered by the current `src/mocks/handlers.ts` and which are missing (I can generate this statically now).

Tell me which of those (or other) follow-ups you'd like and I’ll generate the files/snippets right away (static only).
