Nice — I pulled the list of backend file links you uploaded (backend\_raw\_links.txt) and inspected the repository files linked there.&#x20;

Below is a thorough, practical, code-level analysis of the TopSmile backend: architecture, important implementation details found in the code, risks/bugs, and prioritized recommendations (with concrete fixes where useful). I inspected the core files (app startup, database config, middleware, services, models, key routes). Citations point to the exact source files I used.

---

# Executive summary

* TopSmile is a **Node.js + Express + TypeScript** API using **MongoDB / Mongoose** for persistence. The server is organized around controllers/routes, services, and Mongoose models. The app init shows Helmet, CORS, rate limiting, health endpoints and DB connection logic. ([GitHub][1])
* Authentication uses **HS256 JWT access tokens** (short lived) + **stored refresh tokens** (RefreshToken model) with rotation on use; the code implements token blacklisting in-memory and revocation for refresh tokens. Overall the auth flow is reasonably well designed but has a few bugs/operational issues to fix. ([GitHub][2])
* Scheduling / availability is handled by a dedicated SchedulingService that parses provider working hours, respects buffers, detects conflicts, and uses MongoDB transactions for appointment creation & reschedule to avoid race conditions (good approach). There are DST/timezone parsing steps that deserve focused tests. ([GitHub][3])
* Models are feature-rich (Appointment, Contact, Clinic, Provider, Patient, User) with many indexes aimed at real-world queries (calendar, metrics, availability). This is good for performance but create/index-management must be handled carefully in production. ([GitHub][4])

---

# What I read (key files)

(Representative list — I opened these while analyzing.)

* app.ts (Express bootstrap, security middleware, route mounts). ([GitHub][1])
* authService.ts (JWT handling, refresh tokens, login/register flows). ([GitHub][2])
* schedulingService.ts (availability, create/reschedule/cancel with transactions). ([GitHub][3])
* Contact route + contactService + emailService (contact form pipeline and mailer). ([GitHub][5])
* Models: Appointment, Contact, User, Provider, Clinic, RefreshToken, Patient, PatientUser. ([GitHub][4])
* tokenBlacklistService (in-memory token blacklist). ([GitHub][6])
* database connection / graceful shutdown. ([GitHub][7])

---

# Detailed findings, risks & suggested fixes

Below are grouped findings with their impact and concrete remediation suggestions.

## 1) Authentication & token lifecycle — design + bugs (HIGH)

**What I observed**

* Access tokens are JWTs (HS256) with issuer/audience claims; access tokens are generated in `authService.generateAccessToken`, verified with `verifyAccessToken`. Refresh tokens are random strings stored in `RefreshToken` docs and rotated on use (old refresh token is revoked and a new one created). This is a robust design in principle. ([GitHub][2])
* There is an in-memory token blacklist (Map) used for blacklisting access tokens on logout. That blacklist is not persisted and therefore will not work across multiple app instances. ([GitHub][6])

**Concrete issues / bugs**

1. **Off-by-one / logic bug** in `cleanupOldRefreshTokens` (in authService): the code uses `if (tokens.length >= MAX)` and `tokens.slice(MAX - 1)` which will revoke a token even when the number equals the limit. In effect when `MAX=5` and `tokens.length===5`, the code will revoke the 5th token and reduce active tokens to 4 — not intended. This should be `if (tokens.length > MAX)` and `tokens.slice(MAX)`. ([GitHub][2])

   **Fix (conceptual)**:

   ```ts
   // keep newest MAX tokens
   if (tokens.length > this.MAX_REFRESH_TOKENS_PER_USER) {
     const toRevoke = tokens.slice(this.MAX_REFRESH_TOKENS_PER_USER);
     // revoke those
   }
   ```

   (Also consider doing this with a single DB operation / aggregation to avoid race conditions.)

2. **In-memory token blacklist** is not shared between processes. If you run >1 instance, blacklisted tokens on one instance remain valid on others. Use a distributed store (Redis) to store blacklists with TTL equal to token expiry. ([GitHub][6])

3. **Refresh token concurrency / race**: `createRefreshToken` calls `cleanupOldRefreshTokens` then creates a token; two concurrent logins might both succeed and produce more than MAX tokens due to race. Use atomic DB operations (aggregation with sort+skip or a DB-side cleanup based on `(createdAt < some cutoff)`) or apply a unique index pattern + transactions to enforce limit. ([GitHub][2])

4. **Access token expiry checking & reuse detection**: the refresh flow revokes used refresh tokens (rotation) — good — but consider adding a detection mechanism for refresh token reuse (i.e., if a refresh token that was already rotated is presented AGAIN, treat it as compromise and revoke all tokens for that user). This requires storing some extra metadata (e.g., lastUsedAt, ip/device) on refresh token docs.

**Recommendations (priority: HIGH)**

* Fix off-by-one logic in `cleanupOldRefreshTokens`. ([GitHub][2])
* Replace in-memory blacklist with Redis (or another persistent store) and use token TTLs for expiry. ([GitHub][6])
* Implement refresh-token-reuse detection + revoke all devices on suspicious reuse.
* Consider serving refresh tokens in **secure, HttpOnly cookies** (SameSite) to reduce XSS risk, while leaving access tokens short-lived in memory. (If you keep sending tokens in JSON, document secure client handling.)

---

## 2) Scheduling (availability & appointment creation) — concurrency, timezone, and testing (HIGH)

**What I observed**

* `schedulingService` calculates provider slots using provider working hours, per-provider timezone (`parseTimeToDate` with date-fns-tz), considers bufferBefore/bufferAfter, and uses transactions for appointment create/reschedule to reduce race conditions. Good design. ([GitHub][3])

**Risks / edge cases**

* **DST and timezone edge cases**: `parseTimeToDate` constructs a date/time string and then uses `formatInTimeZone` + `parseISO` — this can work but is subtle around DST transitions. Add focused unit tests across DST boundaries and provider time zones. ([GitHub][3])
* **Replica set requirement:** MongoDB transactions require a replica set (or Atlas). Ensure your deployment uses a replica set; otherwise transactions are no-ops or fail. add detection/guarding in startup or fallback modes. ([GitHub][3])
* **Potential performance**: availability queries iterate 15-minute intervals and query existing appointments once per provider per day (good), but if providers or appointment types are many, consider caching available slots (Redis) or precomputing "busy" intervals. ([GitHub][3])

**Recommendations (priority: HIGH → MEDIUM)**

* Add tests covering DST transitions and boundary times.
* Verify MongoDB is deployed as a replica set in production and document this requirement.
* Consider caching frequent availability responses and invalidating when appointments change.

---

## 3) Models, indexes, and performance (MEDIUM → HIGH)

**What I observed**

* Models (Appointment, Contact, Clinic, Provider, Patient, User) have many indexes tuned for common queries (calendar, provider availability, contact analytics). This is excellent for query performance but needs index management. ([GitHub][4])
* RefreshToken model includes a TTL index on `expiresAt` for automatic cleanup — good. ([GitHub][8])

**Risks**

* **Too many indexes at once**: creating indexes on large collections can block or be costly. Ensure indexes are created in background and perform index migrations outside peak windows.
* **Index usage must be monitored**: some compound indexes might never be used — monitor via `explain()` and remove unused indexes.
* **Sparse / partial indexes**: Use them for fields frequently queried but not always present (e.g., externalId).

**Recommendations (priority: MEDIUM)**

* Add a DB migration / index-management plan (create indexes in background, monitor).
* Instrument slow queries and index usage (MongoDB profiler or APM).
* Use `lean()` for read-heavy queries (already done in parts of scheduling service — good). ([GitHub][3])

---

## 4) Contact pipeline & email (MEDIUM)

**What I observed**

* `POST /api/contact` validates + sanitizes input with `express-validator` + `DOMPurify`, stores (upsert) via `contactService.createContact`, and fires email notifications through `emailService.sendContactEmails`. The service uses SendGrid in production and Ethereal / console fallback for dev. This is a reasonable pipeline. ([GitHub][5])

**Risks**

* Email sending is fired-and-forget via a Promise.catch — ok for low volumes, but for reliability, important notifications should be queued (e.g., Bull / BullMQ or other job queue) so you can retry on failures. The emailService currently `Promise.all` sends two emails — if SendGrid is slow this could still block the worker that invoked it if not queued properly. ([GitHub][9])

**Recommendations (priority: MEDIUM)**

* Move email sending to a job queue (Redis-backed) to enable retry/backoff and observability.
* Sanitize inputs again (server-side) when composing email templates (defense in depth) — currently contact route sanitizes, which is good. ([GitHub][5])

---

## 5) Middleware, validation & error handling (MEDIUM)

**Observations**

* The app uses `express-validator`, `DOMPurify`, `helmet`, `cors`, and custom rate-limiters. `errorHandler` centralizes error responses (hides stack in production). Health and metrics endpoints implemented. Good ops-ready features. ([GitHub][1])

**Improvements**

* Switch from `console.*` to a structured logger (pino/winston) for production to get JSON logs with levels, correlation IDs, and integration with log aggregators.
* Add request IDs and attach them to logs for traceability.
* Ensure CORS allowed origins list is intentionally configured and does not accidentally allow unsafe origins; the code uses an allow-list which is good. ([GitHub][1])

---

## 6) Error handling & typed errors (LOW → MEDIUM)

**What I observed**

* Custom error types (AppError, ValidationError, NotFoundError, etc.) are defined and `errorHandler` uses `isAppError` to render structured responses. Good practice. ([GitHub][10])

**Recommendation**

* Add error codes (machine-friendly) to the error payload for easier client handling and monitoring (the code already uses `code` in some places; standardize it across all AppError uses).

---

## 7) Tests, CI, and operational concerns (MEDIUM)

**What I observed**

* I saw no code for test harnesses here (no tests inspected in the backend files I opened). Given the complexity (scheduling, timezone logic, auth rotation), automated tests are critical.

**Recommendations**

* Add unit tests for: auth flows (login, refresh, logout), scheduling (slot generation across DST), model validations (clinic/phone/CNPJ/CPF), and concurrency tests for appointment creation. Use mongodb-memory-server for fast DB tests.
* Add GitHub Actions for CI that runs lint/tests and builds.
* Add e2e tests for key user journeys (login -> create appointment -> reschedule -> cancel).

---

# Quick prioritized action list (what to do first)

**Immediate (HIGH, 1–2 days)**

1. Fix `cleanupOldRefreshTokens` off-by-one logic (authService). ([GitHub][2])
2. Replace in-memory access token blacklist with Redis (or another distributed store) and wire it into `verifyAccessToken`. ([GitHub][6])
3. Add tests for refresh token rotation and reuse detection; implement logic to revoke all tokens on suspected reuse.

**Near-term (HIGH → MEDIUM, 1–2 weeks)**
4\. Add unit/integration tests for schedulingService—especially timezone/DST. ([GitHub][3])
5\. Move email sending to a job queue (Bull/BullMQ) for reliability. ([GitHub][9])
6\. Ensure production deployment uses MongoDB replica set (document requirement) for transactions. ([GitHub][3])

**Medium (2–4 weeks)**
7\. Introduce structured logging (pino/winston) and request IDs. ([GitHub][1])
8\. Add monitoring/metrics (Prometheus/Grafana, or APM agent).
9\. DB index management plan & migration scripts.

**Low / longer term**
10\. Evaluate moving access tokens to asymmetric signing (RS256) if you need cross-service verification without shared secrets.
11\. Harden rate-limiting per account + per IP.

---

# Notable code-level suggestions & examples

* **Fix refresh token cleanup (exact):** change condition from `>=` to `>` and `slice(MAX)` instead of `slice(MAX - 1)` — prevents accidental revocation. ([GitHub][2])

* **Persist blacklist in Redis**: store token => expiresAt and have `isBlacklisted` check Redis; use Redis TTL to allow automatic cleanup. (This avoids the single-process limitation of the Map approach.) ([GitHub][6])

* **Queue emails**: change `emailService.sendContactEmails(...).catch()` fire-and-forget to enqueue a job; worker processes send the email and record status. This boosts reliability and observability. ([GitHub][5])

* **Validate replica set presence** on startup and error clearly if transactions are required but not available (help ops). ([GitHub][3])

* **DST tests** for `parseTimeToDate(...)`: write tests for providers in `America/Sao_Paulo` across DST boundaries to ensure `formatInTimeZone` + `parseISO` yields consistent UTC timestamps. ([GitHub][3])

---

# Miscellaneous observations (nice-to-know)

* Password handling in `User` and `PatientUser` models uses bcrypt with salt rounds and enforces password complexity; login attempt lockouts implemented — good security hygiene. ([GitHub][11])
* Many routes include swagger-style comments (can be used to generate OpenAPI spec). ([GitHub][12])
* DB connection includes graceful shutdown handlers (SIGINT/SIGTERM) and health endpoints — good Ops features. ([GitHub][7])

---

# Appendix — file pointers I used (short list, clickable in the links file you gave)

* app.ts (server bootstrap). ([GitHub][1])
* authService.ts (token generation + rotation). ([GitHub][2])
* schedulingService.ts (availability & transactions). ([GitHub][3])
* contactService.ts & route (contact form handling). ([GitHub][13])
* emailService.ts (mailer). ([GitHub][9])
* User / PatientUser models (password hashing, lockouts). ([GitHub][11])
* Appointment model (rich fields and indexes). ([GitHub][4])
* RefreshToken model (TTL + schema). ([GitHub][8])
* tokenBlacklistService (in-memory). ([GitHub][6])
* database.ts (connect and graceful shutdown). ([GitHub][7])

(These correspond to the raw GitHub raw URLs you supplied in backend\_raw\_links.txt.)&#x20;

---

If you want, I can **immediately**:

* open a PR patch (diff) that fixes the `cleanupOldRefreshTokens` bug and replaces the in-memory blacklist usage with a Redis-backed abstraction (I can produce the code changes here), or
* create unit test templates for schedulingService covering DST and conflict detection, or
* produce a checklist & CI workflow (GitHub Actions) to run lint/tests and ensure DB replica set requirement.

Which of those would you like first? (I can generate the code/PR patch or tests right away.)

[1]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/app.ts "raw.githubusercontent.com"
[2]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/services/authService.ts "raw.githubusercontent.com"
[3]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/services/schedulingService.ts "raw.githubusercontent.com"
[4]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/models/Appointment.ts "raw.githubusercontent.com"
[5]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/routes/contact.ts "raw.githubusercontent.com"
[6]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/services/tokenBlacklistService.ts "raw.githubusercontent.com"
[7]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/config/database.ts "raw.githubusercontent.com"
[8]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/models/RefreshToken.ts "raw.githubusercontent.com"
[9]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/services/emailService.ts "raw.githubusercontent.com"
[10]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/types/errors.ts "raw.githubusercontent.com"
[11]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/models/User.ts "raw.githubusercontent.com"
[12]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/routes/auth.ts "raw.githubusercontent.com"
[13]: https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/backend/src/services/contactService.ts "raw.githubusercontent.com"
