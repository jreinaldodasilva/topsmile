Thoroughly and meticulously perform a **static full-stack code review** of the TopSmile project using only the inputs provided.
⚠️ Important: Do **not** use any cached knowledge or prior memory about this project. All source code must be taken **directly from the GitHub raw links** listed in the input files below:

- `frontend_raw_links.txt`
- `backend_raw_links.txt`
- `types_raw_links.txt`

These files contain **raw.githubusercontent.com** URLs for every source file you should inspect.

---

## Primary goals
1. Verify **correctness, security, performance,** and **maintainability** across frontend and backend.
2. Ensure **frontend↔backend integration** is consistent (request/response DTOs, error shapes, auth flows).
3. Deliver a prioritized, actionable remediation plan with concrete **patches/diffs**, suggested **tests**, and clear reproduction steps for each issue.

---

## Project summary (for reviewer context)
- **Backend:** Node.js + Express + TypeScript, MongoDB with Mongoose (Controllers → Services → Models).
- **Frontend:** React 18.2.0 + TypeScript (Components → Hooks → Contexts), React Router, Framer Motion, React Icons, React Slick, React Calendar.
- **Testing:** Jest + Supertest (backend), Jest + React Testing Library (frontend), Cypress (E2E), MSW (API mocks), MongoDB Memory Server (DB tests).
- **Shared types:** `@topsmile/types` (verify usage / duplication).

---

## Hard constraints
- **Do not run code.** No builds, no tests, no network calls beyond reading the raw links listed in the three input files.
- **Do not access secrets** (.env, private keys). If files reference secrets, mark as "security observation — references to secret".
- When assumptions are required, **explicitly label** them as `ASSUMPTION:` in the report.

---

## Required deliverables
Produce a single ZIP (or a commit-like bundle) containing:

1. `TOPSMILE_REVIEW.md` — the main Markdown report. It **must** include the sections and subitems below.
2. `patches/` — one or more git-style unified diffs (`.patch`) for concrete fixes (where applicable). Each patch must include a short header with motivation and risk.
3. `issues.json` — machine-readable list of all findings (fields: id, title, severity, file, lineRange, description, reproduction, suggestedFixPatchRef, testsSuggested, confidence).
4. `files_reviewed.txt` — canonical list of all files scanned (skip third-party / auto-generated with reason).
5. `tests_to_add.md` — concrete test snippets (Jest, RTL, Supertest, or Cypress) for high-risk flows.

---

## `TOPSMILE_REVIEW.md` required structure
(Use this exact top-level ordering; each section should be concise + actionable.)

1. **Title & TOC**  
2. **Executive summary (1 paragraph)**  
   - Single overall health sentence + top 3 action items (one-line each).

3. **Quick issues table**  
   - Table with columns: `ID | Short title | Severity | Area (frontend/backend/shared) | File(s) | Patch? (Y/N)`.

4. **Architecture overview**  
   - Short textual description of request/response flow.
   - **Mermaid** diagram showing: `UI → Router → Component → API call → Controller → Service → Model → DB`.
   - List of global cross-cutting concerns (auth, logging, error format, shared types).

5. **Security review**  
   - Enumerate security findings. For each: `ID, severity (Critical/High/Medium/Low), file:line-range (or raw URL), reproduction steps, impact, suggested fix (short diff or code snippet), test or detection rule (unit/CI)`.
   - Checkpoints to include: auth, JWT/session handling, password storage, input validation, XSS, CSRF, injection (NoSQL/SQL), unsafe eval/dynamic templates, CORS, insecure deps.

6. **Correctness & logic issues**  
   - Backend: broken logic, race conditions, incorrect status codes, silent failures.
   - Frontend: state/prop bugs, stale renders, wrong form validation, mismatch in field names/types.
   - For each: reproduce steps, code references, suggested patch, and a unit/integration test to prevent regression.

7. **API contract & integration map**  
   - Table of endpoints discovered: `METHOD | PATH | Request shape (fields + types) | Response shape | Status codes`.
   - Map each frontend API call (file + function) → backend controller (file + function).
   - Flag mismatches and show minimal example patch (or type import) to fix them.
   - Recommend contract enforcement (shared types usage, example OpenAPI or Zod snippet).

8. **Frontend–Backend integration risks**  
   - List issues where request/response shapes, error shapes, or auth flows disagree.
   - Propose short-term fixes (adapter functions, type imports) and medium-term fixes (codegen/shared package).

9. **Performance & scalability**  
   - Backend: expensive queries, missing indexes, N+1 patterns; include sample Mongo queries and suggested indexes.
   - Frontend: expensive re-renders, unoptimized lists, unnecessary network calls; include suggestions (memo, virtualization, debounce, lazy load).

10. **UI/UX & Accessibility (a11y)**  
    - Highlight missing focus management, aria attributes, contrast issues, keyboard navigation gaps, and problematic animations.
    - Provide concrete fixes and code snippets.

11. **Error handling & feedback loops**  
    - Confirm standardized error format; if inconsistent, provide adapter and test suggestions.
    - Verify front-end surfaces backend errors meaningfully.

12. **Database & schema review**  
    - Mongoose models: required fields, validators, indexes, consistency vs DTOs.
    - Identify risky nullable fields or missing constraints.

13. **Testing & QA**  
    - Coverage gaps by area (auth, appointment scheduling, boundary cases).
    - Provide example test cases and minimal code snippets for each missing test (Jest/Supertest/RTL/Cypress).

14. **Dependencies & vulnerabilities**  
    - Flag obviously outdated or insecure packages (name + version from package.json if present).
    - Suggest safer or maintained alternatives.

15. **Code quality & maintainability**  
    - TypeScript issues: any `any` abuses, missing return types, duplicated types, exported-but-unused.
    - Frontend: hook anti-patterns, duplication, prop drilling vs context.
    - Redundancy check: files or logic present in both layers that should be shared.

16. **Observability & monitoring**  
    - Logging level/format suggestions, error reporting integration points (Sentry), tracing suggestions for critical flows.

17. **Migration strategy — shared types unification**  
    - Short, medium and long-term plan (concrete steps), and example diffs for the first 2 steps (replace local type X with import from `@topsmile/types`).

18. **Prioritized TODO list**  
    - Top 9 improvements ordered by severity + estimated difficulty (Small/Medium/Large) and suggested owner (frontend/backend/shared).

19. **Files examined**  
    - `files_reviewed.txt` contents, with skipped files annotated and reasons.

20. **Assumptions & confidence**  
    - For each major finding, note confidence (High/Medium/Low) and any assumptions made.

---

## Patch & diff guidelines
- Provide **git unified diffs** (`diff --git a/... b/...` format) under `patches/`. Each patch must:
  - Have a short header: `Title`, `Motivation`, `Risk & Regression windows`.
  - Be minimal and scoped to a single intent.
  - Include test(s) where feasible.

---

## Severity definitions (use these)
- **Critical** — security vulnerability with immediate exploitability, data loss, or breakage of core flow (auth, payments, scheduling)  
- **High** — major correctness or security flaw that risks user data or core features  
- **Medium** — performance, robustness, or maintainability problems causing degraded UX or developer pain  
- **Low** — style, consistency, or minor improvements

---

## Issue reporting format (issues.json fields)
- `id` (string)
- `title` (string)
- `severity` (Critical/High/Medium/Low)
- `area` (frontend/backend/shared)
- `file` (path or raw.githubusercontent.com URL)
- `lineRange` (e.g., 120-140)
- `description` (concise)
- `reproductionSteps` (numbered)
- `suggestedFixPatchRef` (e.g., `patches/0003_fix-auth.patch`)
- `testsSuggested` (list)
- `confidence` (High/Medium/Low)

---

## Acceptance criteria (what counts as “done”)
- `TOPSMILE_REVIEW.md` delivered and follows the required structure.
- `issues.json` lists every finding referenced in the report.
- `patches/` contains at least one **ready-to-apply** patch for every Critical and High issue (where a code change is applicable).
- `files_reviewed.txt` and `tests_to_add.md` included.
- All suggested fixes include reproduction steps and at least one unit/integration test suggestion.
- All analysis is based **only** on the provided raw GitHub links.  

---

## Reporting style & tone
- Use clear, actionable language.
- Prefer small code diffs and short examples over long essays.
- Label any guess or assumption explicitly.

---

## Useful formatting rules for the reviewer
- Use `file:line-start-line-end` when referencing code.
- Use Mermaid for single diagrams only (diagram must render in Markdown).
- Keep each suggested code snippet ≤ 80 lines when possible.
