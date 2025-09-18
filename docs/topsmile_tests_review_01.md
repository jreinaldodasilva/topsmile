# TopSmile — Static Test Review & Improvement Plan
---

## 0) High-level summary / health

* The repository **already contains** a relatively complete testing setup:

  * Frontend: `Jest` via `react-scripts` + `@testing-library/react`, `msw` for request mocking, test files under `src/tests`.
  * Backend: `jest` + `ts-jest` with `mongodb-memory-server` for DB isolation; unit and integration tests exist under `backend/tests`.
  * E2E: Cypress config and tests under `cypress/` (project root).
* `msw` handlers are implemented at `src/mocks/handlers.ts` and the testing server is started in `src/setupTests.ts`. Backend uses `MongoMemoryServer` in `backend/tests/setup.ts`.
* There are **many tests** (frontend \~28 test files, backend \~13 test files). A backend coverage report directory exists — good sign.

Overall: **solid foundation**. Below I list issues found, gaps, and a prioritized improvement plan with sample code.

---

# 1) Test infrastructure review (Jest, Cypress, MSW)

### Files I found & their locations

* Frontend Jest config: `jest.config.js` (root of project) — uses `react-scripts` default config extended with polyfills and `setupFiles`.
* Frontend test setup: `src/setupTests.ts`, `src/jest-pre-setup.ts`, `src/textEncoderPolyfill.js`, `src/msw-polyfills.js`.
* MSW mocks: `src/mocks/handlers.ts`, `src/mocks/server.ts`, `src/mocks/browser.ts`.
* Cypress: `cypress.config.js` (root) and `cypress/` folder with tests.
* Backend Jest config: `backend/jest.config.js`, backend test setup `backend/tests/setup.ts`.
* Root scripts: test scripts in `package.json`: `test`, `test:frontend`, `test:backend`, `test:e2e`, `cy:open`, `cy:run` etc.

### Good things

* `src/setupTests.ts` establishes `msw` server lifecycle (listen/resetHandlers/close) — correct approach.
* `msw` polyfills are included (TransformStream etc.) which MSW v2 may need for node/browser envs.
* Backend `tests/setup.ts` uses `mongodb-memory-server` and cleans collections after each test — good isolation intent.
* Backend tests use `ts-jest` preset and `setupFilesAfterEnv` to run `tests/setup.ts`.
* Separate test scripts for frontend/backend/e2e exist in `package.json`.

### Issues & misconfigurations (static):

1. **Jest runner / test selection ambiguity in root `test` script**

   * `package.json` root `"test": "cross-env NODE_ENV=test jest --runInBand"` — this will run *all* Jest tests (frontend + backend) if jest can discover them. But backend has its own `jest.config.js` (in `backend/`) with `preset: ts-jest`. Running top-level `jest` may discover TypeScript-only backend tests in a different config or fail to apply `backend/jest.config.js`. The project already provides `test:frontend` and `test:backend`; prefer running them separately in CI.
   * **Recommendation:** set `test` to run both in sequence or direct users to `npm run test:frontend` and `npm run test:backend`. For CI use explicit separate steps.

2. **`react-scripts` + custom `jest.config.js` mixture**

   * The root `jest.config.js` calls `createJestConfig` from `react-scripts` and then extends it — this is okay but delicate. Ensure `testMatch` / `testPathPattern` align to run intended tests only.
   * The root `package.json` contains `jest` in `devDependencies` and also `react-scripts` uses its own jest. Version mismatches between `jest` and `react-scripts` may cause weird behavior. Currently root dev deps use `jest@27` which matches create-react-app v5 default; still check versions in your lockfile.

3. **TypeScript integration for front-end tests**

   * Frontend uses `react-scripts` (CRA) to run tests — CRA handles TS with Babel transform. The project also uses some TypeScript `.test.tsx` files — that should be fine if `react-scripts` is used to run frontend tests.
   * However, `jest.config.js` `setupFiles` includes `.ts` file (`src/jest-pre-setup.ts`). CRA-generated Jest config expects JS files for `setupFiles` (but it can run TypeScript if ts-jest or appropriate transformer present). The project includes `babelTransform` path, but keep an eye: if `jest` is run directly (not via `react-scripts`), `.ts` setup files may not be transpiled. Running frontend tests with `react-scripts test` is safest.

4. **Cypress baseUrl and test orchestration**

   * `cypress.config.js` has `baseUrl: 'http://localhost:3000'`. For local interactive runs that's OK, but for CI you must start the app (frontend and possibly backend) before Cypress runs, or modify config to point at a deployed/test server.
   * No `component` testing config present (only `e2e`) — if you plan Cypress component tests, add that config.

5. **MSW handler/route parity risk**

   * Handlers are implemented at `src/mocks/handlers.ts`. They look fairly comprehensive. Static comparison suggests they match many `/api/*` endpoints.
   * **Risk:** if backend routes or DTO names change, MSW handlers may drift and tests will pass while integration with the real backend will fail. Keep MSW handlers in sync with backend route contracts.

6. **Test timeouts and forceExit**

   * Backend `jest.config.js` sets `forceExit: true`. That can hide test leakage problems. It’s better to locate the open handles and fix them rather than forcing exit. `detectOpenHandles: true` is also set — good but combined with `forceExit` it may mask real problems.

7. **Coverage of E2E environment in CI**

   * `test:e2e` runs `cypress run` — ensure CI step starts the app (and backend) with the right environment prior to running Cypress. The repo has `dev` script using `concurrently` to start both, which is fine for local dev but CI should start services in detached or separate steps.

---

# 2) Backend testing — static findings

### What exists (static)

* `backend/tests/` contains:

  * `unit/services/*.test.ts` for services (appointments, auth, scheduling, providers, etc.)
  * `integration/*.test.ts` (authRoutes, patientRoutes, patientPortal, security, performance)
  * `tests/setup.ts` starts `MongoMemoryServer`, connects mongoose and clears collections after each test. Sets `JWT_SECRET` if missing.
  * `tests/customMatchers.ts` present.
  * `testHelpers.ts` present likely helps create test fixtures.

### Good points

* `MongoMemoryServer` is used to isolate DB (good).
* Setup/teardown lifecycle hooks exist (`beforeAll`, `afterEach`, `afterAll`) and clean collections.
* Tests use `supertest` (observed as dependency) for integration tests — typical and correct.

### Static issues / gaps

1. **Coverage gaps visible in lcov report**

   * Coverage HTML exists under `backend/coverage/lcov-report`. This indicates some controllers or models may have low coverage; you should open the HTML in the browser to see exact uncovered files. (I saw coverage files present; if you want I can extract a list of low-coverage files from `coverage/coverage-summary.json` file if present.)

2. **Token blacklist/cleanup intervals**

   * `tests/setup.ts` stops `tokenBlacklistService.stopCleanup()` in `afterAll`, but make sure the service is not started by some tests unexpectedly and leaving timers open. Timers are a frequent cause of Jest open-handle warnings.

3. **Overlap/edge-case scheduling tests**

   * There are `schedulingService`/`appointmentService` unit tests, but I could not confirm if **appointment overlap rules**, timezone logic, DST edge cases, and validation around provider availability are fully covered. These are common sources of regression.
   * **Recommendation:** add tests covering:

     * Overlap detection for appointments with shared provider but different durations/timezones.
     * Daylight-saving transitions, provider time zone mismatches.
     * Concurrent create requests (performance/locking/concurrency scenario) — simulate parallel writes to ensure the system prevents double-booking.

4. **Auth & validation**

   * Auth routes and services tests exist. Check whether tests exercise:

     * Token expiry behavior, refresh tokens, invalid signature handling.
     * Rate limiter behavior (authLimiter): because rate limiter uses Express middleware, you may need integration tests that simulate multiple attempts and assert 429 behavior.
     * Sanitization (DOMPurify, express-validator) — tests should include malicious inputs to confirm they are sanitized and validated.

5. **DB seeding & fixtures**

   * A single `tests/testHelpers.ts` exists. Ensure fixtures are deterministic and small. Large fixtures slow tests.

6. **Performance / security tests**

   * I see `integration/performance.test.ts` and `integration/security.test.ts`. Check these rely on mocks (they should not hit external services). If they are expensive or flaky, categorize them as smoke or nightly tests.

---

# 3) Frontend testing — static findings

### What exists

* Tests under `src/tests/*` covering components, pages, contexts, hooks, services:

  * Auth forms: `src/tests/components/Auth/LoginForm.test.tsx`, `RegisterPage.test.tsx`, `LoginPage.test.tsx`.
  * Appointment calendar: `AppointmentCalendar.test.tsx` and patient booking pages.
  * Context tests: `AuthContext.test.tsx`, `ErrorContext.test.tsx`.
  * Service tests: `apiService.test.ts`, `paymentService.test.ts`.
  * Utilities: `src/tests/utils/test-utils.tsx`, `apiMocks.ts`, `mockData.ts`, `testHelpers.tsx`.
* `MSW` is used in tests (server is created in `src/mocks/server.ts` and started in `src/setupTests.ts`).

### Good points

* The project uses `msw` (recommended) instead of heavy mocking patterns in the client tests.
* `setupTests` starts the MSW server globally — consistent approach to mocking fetch/XHR.
* Test utils exist to DRY provider wrappers, which usually improves readability.

### Issues & gaps (static)

1. **MSW handler coverage vs backend API**

   * The MSW handlers cover many `/api/*` endpoints (auth, patients, appointments, admin/contacts). Good. But ensure the **request/response shapes** in handlers match backend DTOs exactly (field names, nested structures). A few mismatches can allow front-end tests to pass while real integration will fail.
   * Example: check expected fields for `patient` in frontend components (is frontend expecting `firstName` vs backend `name`?). I saw handlers returning `firstName`/`lastName`. Ensure components use same.

2. **Testing loading & error states**

   * Many component tests exist, but it’s important they assert:

     * Loading states (spinners/disabled buttons).
     * Error messages when MSW returns `500`/`400` — tests should `server.use()` to override handlers for error cases.
     * Transitions (e.g., navigation after successful login) — test for redirect behavior via router history.

3. **Selectors & test resilience**

   * Tests should prefer `getByRole`, `getByLabelText`, and `getByText` for accessibility-based stable selectors. Avoid `data-testid` unless necessary.
   * Check existing tests for brittle selectors (like `querySelector('.class-name')`). If present, refactor to RTL queries or add `aria-*` attributes.

4. **React Query / cache handling**

   * Project uses `@tanstack/react-query`. Tests must wrap components with `QueryClientProvider` and clear/reset query cache between tests (test-utils probably does this). Confirm `test-utils` resets `QueryClient` per test to avoid cache bleed.

5. **Time-sensitive UI (calendar/appointments)**

   * Calendar components often rely on `Date` now. Tests should fix `Date` with `mockDate` or `jest.useFakeTimers` for deterministic behavior; I did not see a global mock for `Date` — check relevant calendar tests.

6. **E2E vs component overlap**

   * Many flows are covered by unit/integration tests. Check to avoid duplication between E2E and integration tests unless E2E covers full flows and integration checks internal logic.

---

# 4) End-to-end (Cypress) — static findings

### Files found

* `cypress.config.js` with `baseUrl: 'http://localhost:3000'`.
* `cypress/` folder with tests (I inspected that the folder is present; I did not execute tests).

### Good points

* E2E config is present and points at typical dev server port 3000.

### Issues & missing scenarios

1. **Start dependencies for Cypress**

   * `cypress run` needs the app running. Local dev `npm run dev` starts both server & client using `concurrently`, but **CI must start the server first** or use `start-server-and-test` script.
   * Add a script such as:

     ```json
     "cy:ci": "start-server-and-test start http://localhost:3000 cy:run"
     ```

     or use `npx start-server-and-test` to make CI reliable.

2. **Test coverage gaps** (recommended additions)

   * Mobile responsiveness flows (Cypress can set viewport sizes and assert layout changes).
   * Error recovery and offline flows (simulate backend returning errors).
   * Deep linking: linking directly to appointment detail pages without prior client-side navigation to validate server-side route handling and guard logic.
   * Payment flows: if Stripe is used in-app, create a test mode for E2E (it’s sensitive — use Stripe test keys and avoid real transactions).

3. **Authentication and cleanup**

   * Ensure Cypress tests clean test data between runs or use dedicated test accounts so tests are idempotent.

---

# 5) Test code quality & maintainability — static observations

### Redundant / brittle test patterns to look for

* Tests that rely on exact HTML structure or CSS class names (use role/label queries instead).
* Tests that rely on global state from previous tests (ensure `afterEach` resets mocks, msw handlers are reset).
* Use of `forceExit: true` for backend tests — this can hide open-handle issues that should be fixed.

### Suggested refactors

* Create **custom test utils** (already present in `src/tests/utils/test-utils.tsx`) and standardize across tests to ensure consistent providers (`AuthContext`, `QueryClient`, `Router`) and teardown.
* Centralize `msw` test responses and test fixtures under `src/tests/utils/apiMocks.ts` / `mockData.ts` and import them in tests. This seems already partially done — enforce use.
* Use `async/await` consistently and `await findBy*` for async UI changes, not `waitFor` unless necessary.
* Improve naming conventions: test filenames reflect component or page and expected behaviour, e.g., `LoginForm.shouldSubmitAndRedirect.test.tsx` style for clarity. Ensure tests files are in mirrored structure to `src/components`.

---

# 6) Prioritized TODO (Top 5 fixes first)

1. **Separate frontend & backend test runs in CI & update `test` script**

   * Replace ambiguous root `test` script or make it explicit:

     * Add scripts:

       ```json
       "test:all": "npm run test:backend && npm run test:frontend"
       ```
     * Or set `test` to run both sequentially rather than call `jest` at root which can conflict with configs.

2. **Remove `forceExit: true` from backend `jest.config.js` and identify open handles**

   * Temporarily run backend tests with `--detectOpenHandles` and fix timer/db connection leaks instead of forcing exit.

3. **Ensure MSW handlers and backend routes/DTOs are synchronized**

   * Create an automated route/contract checklist and add a fail-fast test that runs the schema/shape check between MSW mock shape and TypeScript DTOs (or at least a review step in PR).

4. **Add tests for appointment overlap, timezone/DST edge cases, and concurrent booking**

   * Add unit tests to `schedulingService`/`appointmentService` covering:

     * Overlap detection (start/end inclusive/exclusive).
     * DST transition booking boundaries.
     * Simulate concurrent create attempts (race conditions).

5. **Add Cypress CI orchestration script**

   * Add `start-server-and-test` usage or `concurrently` CI-safe script to start both backend and frontend before `cypress run`. Document the required ENV (mock `.env.test`) for cypress runs.

---

# 7) Recommended additional tests (edge cases & performance)

**Backend**

* Appointment overlap test matrix:

  * Existing appt: 10:00–10:30

    * New appt starting 09:45–10:00 (touching start) — allowed or not? assert expected behavior.
    * New appt starting 10:30–11:00 (touching end) — allowed or not?
    * New appt inside existing window 10:05–10:25 — reject.
  * Tests across provider time zones.
* Concurrency: spawn two parallel create requests for the same slot — assert only 1 succeeds. This may require transactional semantics or a unique index and proper handling of duplicate-key errors.
* Rate limiter tests for login routes — simulate >5 requests to ensure `429` is returned.
* Validation & sanitization tests: send XSS/payload in `name` or `notes` fields and assert sanitization.

**Frontend**

* Login flow:

  * Success: valid credentials -> redirect to dashboard -> token stored in localStorage (or cookie).
  * Failure: invalid cred -> shows localized error message; login button re-enabled.
* Appointment booking UI:

  * Loading state on submit.
  * Error state when server returns `409` (conflict) for overlapping appointment.
  * Calendar rendering for multiple timezones (with mocked `Date`).
* Payment form:

  * Test UI behavior when Stripe returns a decline error (use MSW or Stripe test mode).
* Accessibility tests (axe-core integration, or at least per-component `getByRole` selectors).

**Cypress (E2E)**

* Full happy-path flows:

  * Signup -> email verify? -> login -> book appointment -> confirm appointment appears in dashboard -> logout.
  * Update appointment -> verify update appears.
  * Delete appointment -> verify removal.
* Error recovery flows:

  * Simulate server error on booking -> app shows friendly retry option.
* Mobile: run critical flows on `cy.viewport('iphone-6')`.

---

# 8) Example test snippets

Below are **example** snippets to illustrate recommended improvements. These are **static** examples you can copy into the repo.

## A) Backend: appointment overlap unit test (Jest + ts-jest)

```ts
// backend/tests/unit/services/appointmentOverlap.test.ts
import { AppointmentService } from '../../../src/services/appointmentService';
import { connectToTestDb, disconnectTestDb, clearTestDb } from '../../testHelpers';

describe('Appointment overlap rules', () => {
  beforeAll(async () => {
    await connectToTestDb();
  });
  afterEach(async () => {
    await clearTestDb();
  });
  afterAll(async () => {
    await disconnectTestDb();
  });

  it('rejects an appointment that overlaps an existing appointment for the same provider', async () => {
    // create existing appointment 10:00 - 10:30
    const providerId = 'prov1';
    const existing = await AppointmentService.create({
      provider: providerId,
      patient: 'p1',
      start: new Date('2025-10-05T10:00:00Z'),
      end: new Date('2025-10-05T10:30:00Z'),
    });

    // attempt to create overlapping appointment 10:05 - 10:25
    await expect(
      AppointmentService.create({
        provider: providerId,
        patient: 'p2',
        start: new Date('2025-10-05T10:05:00Z'),
        end: new Date('2025-10-05T10:25:00Z'),
      })
    ).rejects.toThrow('Appointment overlaps existing appointment');
  });

  // Add tests for edge-touching times (10:30 start) depending on your policy
});
```

## B) Frontend: a resilient login test using RTL + MSW

```tsx
// src/tests/components/Auth/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeServerError, makeLoginSuccess } from '../../tests/utils/apiMocks';
import App from '../../../App';
import { server } from '../../../mocks/server';

// default handlers from handlers.ts will return success for admin@topsmile.com
test('successful login stores token and redirects to dashboard', async () => {
  render(<App />); // or render with router wrapper via your test-utils

  userEvent.type(screen.getByLabelText(/E-mail/i), 'admin@topsmile.com');
  userEvent.type(screen.getByLabelText(/Senha|Password/i), 'SecurePass123!');
  userEvent.click(screen.getByRole('button', { name: /Entrar|Login/i }));

  // wait for navigation and assert the dashboard content
  expect(await screen.findByText(/Bem-vindo|Welcome/i)).toBeInTheDocument();
  // assert token was saved
  expect(localStorage.setItem).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('mock-access-token'));
});

test('shows error message on invalid credentials', async () => {
  server.use(makeServerError('/api/auth/login', 401, { message: 'E-mail ou senha inválidos' }));
  render(<App />);
  // ... fill form and submit
  expect(await screen.findByText(/E-mail ou senha inválidos/)).toBeInTheDocument();
});
```

> `makeServerError` and `makeLoginSuccess` would be small helper wrappers you add to `src/tests/utils/apiMocks.ts` that call `server.use()` with a handler override.

## C) Cypress: orchestration script and example test

Add script in `package.json`:

```json
"scripts": {
  "start": "react-scripts start",
  "server": "cd ./backend && npm run dev",
  "dev": "concurrently \"npm run server\" \"npm run start\"",
  "cy:open": "cypress open",
  "cy:run": "cypress run",
  "cypress:ci": "start-server-and-test 'npm run dev' http://localhost:3000 cy:run"
}
```

Example Cypress test:

```js
// cypress/e2e/booking.cy.js
describe('Booking flow', () => {
  it('user can login and book appointment', () => {
    cy.visit('/');
    cy.get('input[name="email"]').type('admin@topsmile.com');
    cy.get('input[name="password"]').type('SecurePass123!');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    // proceed to appointment booking
    cy.contains('Agendar').click();
    cy.get('[data-cy=date-picker]').click();
    // pick a date/time then submit form
    cy.get('button').contains('Confirmar').click();
    cy.contains('Confirmado').should('exist');
  });
});
```

> Use `data-cy` attributes on crucial UI elements to avoid fragile selector reliance.

---

# 9) How to run tests locally (Execution plan)

> **Important**: I did not run these commands — these are how you *should* run them based on repo scripts and standard setup.

### Setup (one-time)

1. Clone and install:

   ```bash
   npm install        # installs frontend dev deps + prepares backend via prepare script
   cd backend
   npm install        # ensure backend deps installed
   cd ..
   ```

   (Root `prepare` script already does `cd backend && npm install`.)

2. Create a `.env.test` for test environment variables (copy `.env.example`):

   * At minimum ensure:

     ```
     JWT_SECRET=your_test_secret
     NODE_ENV=test
     PORT=5000
     ```
   * Backend tests use `JWT_SECRET` fallback if not set, but explicit is better.

### Running backend tests

```bash
cd backend
npm test                 # runs jest using backend/jest.config.js
# or, to view coverage:
npm run test:coverage
```

* This runs `ts-jest` tests and uses `mongodb-memory-server` so no external DB is required.
* If tests hang, remove `forceExit: true` and run `jest --detectOpenHandles` to find open handles.

### Running frontend tests (unit & integration)

```bash
# from project root
npm run test:frontend    # uses react-scripts test runner and src/setupTests.ts
# or run:
npm test                 # (if you keep root test as cross-env jest, be careful)
# to run coverage:
npm run test:coverage:frontend
```

* `react-scripts test` will pick up TS tests under `src/tests`. Use `--watchAll=false` in CI.

### Running Cypress E2E locally

1. Start both server and client (dev):

   ```bash
   npm run dev
   ```

   That runs both backend and frontend concurrently.
2. In another terminal, run:

   ```bash
   npm run cy:open   # interactive
   npm run cy:run    # headless
   ```

* For CI: use the `cypress:ci` pattern above (start-server-and-test).

### CI notes

* CI must:

  * `npm ci` or `npm install` (both frontend & backend).
  * For backend tests, no external DB is needed because `mongodb-memory-server` is used.
  * For Cypress E2E, either start the dev servers in CI (expose port 3000) or point Cypress to a deployed test environment.
  * Ensure headless browsers and dependencies are available (Cypress container or GitHub Action with `cypress-io/setup`).

---

# 10) Regression risks & coverage gaps (concise)

* **Appointment overlap & concurrency** — risk of double-booking if race conditions untested.
* **Timezone / DST handling** — calendars often fail on DST transitions if not explicitly tested.
* **Auth/rate-limiter edge cases** — rate limiter and token blacklisting timers are fragile.
* **MSW drift** — front-end tests may pass while real backend contract changed.
* **Open/test handles** — `forceExit` may hide leaks that cause flakiness in CI.

---

# 11) Recommended project/test hygiene & checklist

1. **CI pipeline**:

   * Run `npm ci` at root.
   * Run `npm run test:backend` (fail fast on coverage threshold).
   * Run `npm run test:frontend`.
   * Start server(s) and run `npm run cy:run`.
2. **Remove `forceExit: true`** (backend) and fix open handles.
3. **Add test matrix** (appointment edge cases, DST, concurrency).
4. **Add `data-cy` attributes** for critical E2E selectors; prefer `getByRole`/`Label` for RTL.
5. **Automate MSW contract check**: add a developer script that warns when backend route names/response fields differ from MSW (manual check may be required or implement a simple test which imports backend DTO typings).
6. **Test speed**: mark long performance tests (integration/perf) as `skip` in PR or run in nightly pipeline.

---

# 12) Additional suggestions (nice-to-haves)

* Use `--runInBand` only when debugging; prefer parallel Jest runs in CI for speed unless DB isolation requires serial runs.
* Set Jest coverage thresholds and fail build if coverage drops below acceptable levels.
* Add a `test:watch:backend` script for developer convenience.
* Add `cypress` GitHub Actions (or other CI provider) config snippets to run E2E tests automatically.

---

# 13) Final prioritized TODO list (actionable)

**Top 5 fixes (highest priority)**

1. **Fix test orchestration** — change the root `test` script to run frontend & backend tests explicitly or update CI to call `test:frontend` and `test:backend` separately.
2. **Remove `forceExit` and fix open handles** — in `backend/jest.config.js`, remove `forceExit: true` and address timers (e.g., token cleanup interval), DB close, etc.
3. **Add deterministic concurrency tests for appointments** — cover race conditions and overlapping bookings.
4. **Add test-run orchestration for Cypress in CI** — `start-server-and-test` or separate start/stop scripts that work in CI.
5. **Add MSW contract verification** — add a lightweight task or tests to ensure MSW mocks follow backend DTO field names.

**Next 10 (lower priority but recommended)**

* Create DST/timezone test cases for calendar.
* Improve selector usage in frontend tests (`getByRole`/labels).
* Add error-state MSW responses tests for key flows.
* Centralize fixtures & mock factories in `src/tests/utils`.
* Add coverage thresholds & fail CI on regressions.
* Add mobile Cypress flows.
* Add scripts/documentation for running tests locally and in CI (README section).
* Revisit `jest.config.js` to ensure `setupFiles` types are compatible when running jest directly vs `react-scripts`.
* Add automation for running integration/perf tests nightly to avoid slowing PRs.
* Keep `msw` handlers small and DRY; add helper to alter responses in tests.

---
