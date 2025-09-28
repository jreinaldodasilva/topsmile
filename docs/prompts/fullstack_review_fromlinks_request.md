# TopSmile Full-Stack Static Code Review Prompt

Perform a **comprehensive static full-stack code review** of the **TopSmile project**, a full-stack dental clinic management system with separate patient and admin portals.  

Use the file lists below as the **only source of code to inspect**:  
- `frontend_raw_links.txt`  
- `backend_raw_links.txt`  
- `types_raw_links.txt`  

Each contains `raw.githubusercontent.com` URLs pointing to project source files.  

---

## Review objectives
1. Assess **correctness, security, performance, and maintainability** across the entire stack.  
2. Validate **frontend ↔ backend integration**, including DTO consistency, error formats, and authentication flows.  
3. Deliver a prioritized remediation plan with:  
   - **Concrete git-style patches/diffs**  
   - **Test suggestions** (unit/integration/E2E)  
   - **Reproduction steps** for each issue  

---

## Project context (from system review)
- **Backend**: Express.js + TypeScript, MongoDB (Mongoose), Redis caching, JWT auth with refresh tokens & RBAC, Pino logging, SendGrid email, Swagger/OpenAPI.  
- **Frontend**: React 18 + TypeScript, React Router v6, React Query, React Context, CSS Modules, Framer Motion, lazy loading.  
- **Cross-cutting concerns**: Helmet, CORS, CSRF (double-submit cookie), rate limiting, input sanitization.  
- **Testing**: Jest + Supertest (backend), Jest + RTL (frontend), Cypress (E2E), MSW (API mocks).  
- **Shared types**: TypeScript definitions in `/types` (verify for duplication and consistent usage).  
- **Key modules**: Authentication/authorization, multi-role management, appointment scheduling, patient/doctor portals, admin dashboards.  

---

## Deliverables (bundle in a ZIP or commit-like archive)
1. `TOPSMILE_REVIEW.md` — main structured Markdown report (see below).  
2. `patches/` — one or more git unified diffs for concrete fixes (with motivation + risk).  
3. `issues.json` — machine-readable issue list (`id, title, severity, area, file, lineRange, description, reproduction, suggestedFixPatchRef, testsSuggested, confidence`).  
4. `files_reviewed.txt` — canonical list of scanned files, with skipped files noted (and reason).  
5. `tests_to_add.md` — concrete missing test snippets (Jest, RTL, Supertest, Cypress).  

---

## `TOPSMILE_REVIEW.md` required structure
1. Title & TOC  
2. Executive summary — overall health + top 3 action items  
3. Quick issues table — `ID | Short title | Severity | Area | File(s) | Patch?`  
4. Architecture overview — flow description + Mermaid diagram (`UI → Router → Component → API → Controller → Service → Model → DB`) + cross-cutting concerns  
5. Correctness & logic issues — backend + frontend findings (with repro, patch, test)  
6. API contract & integration map — endpoint table + frontend→backend mapping + mismatches & fixes  
7. Frontend–Backend integration risks — short- and medium-term fixes  
8. Performance & scalability — backend (queries/indexes) + frontend (renders, network)  
9. UI/UX & Accessibility — focus, aria, keyboard navigation, contrast, animations  
10. Error handling & feedback loops — consistency of error format + frontend surfacing  
11. Database & schema review — Mongoose validators, indexes, risky nullables  
12. Testing & QA — coverage gaps + suggested tests  
13. Dependencies & vulnerabilities — outdated/insecure packages  
14. Code quality & maintainability — TS typing, hook patterns, duplication, prop drilling  
15. Observability & monitoring — logging, error tracking, tracing suggestions  
16. Migration strategy — unify shared types (`@topsmile/types`) with short/medium/long-term plan + example diffs  
17. Prioritized TODO list — top 9 improvements with severity, effort (S/M/L), and suggested owner  
18. Files examined — canonical list with skips annotated  
19. Assumptions & confidence — confidence levels + assumptions  

---

## Patch & diff guidelines
- Format: **git unified diff** (`diff --git a/... b/...`)  
- Each patch must include:  
  - **Title**  
  - **Motivation**  
  - **Risk & regression window**  
- Keep patches minimal, scoped, and test-covered.  

---

## Severity levels
- **Critical** — exploitable vulnerabilities, data loss, or core flow breakage  
- **High** — correctness/security flaws threatening user data or features  
- **Medium** — performance, robustness, or maintainability problems  
- **Low** — style/consistency improvements  

---

## Reporting style
- Concise, actionable, and consistent.  
- Prefer **short code diffs/examples** over long explanations.  
- Label assumptions explicitly.  
- Use `file:lineStart-lineEnd` for references.  
- Keep code snippets ≤ 80 lines.  
- Only one **Mermaid diagram** (system flow).  

---

## Acceptance criteria
- All deliverables present (`TOPSMILE_REVIEW.md`, `issues.json`, `patches/`, `files_reviewed.txt`, `tests_to_add.md`).  
- Critical/High issues must include **ready-to-apply patches** with repro + tests.  
- All analysis based strictly on provided GitHub raw links (no external assumptions).  
