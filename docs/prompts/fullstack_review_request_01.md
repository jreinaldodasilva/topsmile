Perform a **comprehensive static full-stack code review** of the **TopSmile** project using the following sources:

* `frontend_raw_links.txt`
* `backend_raw_links.txt`
* `types_raw_links.txt`

Each file contains **raw.githubusercontent.com** URLs for every source file to be reviewed.

---

## Review objectives

1. Assess **correctness, security, performance,** and **maintainability** across both frontend and backend.
2. Validate **frontend↔backend integration**: request/response DTOs, error handling, and authentication flows.
3. Deliver a prioritized, actionable remediation plan with:

   * **Concrete git-style patches/diffs**
   * **Suggested tests** (unit, integration, or E2E)
   * **Clear reproduction steps** for each issue

---

## Project context

* **Backend:** Node.js + Express + TypeScript, MongoDB (Mongoose: Controllers → Services → Models)
* **Frontend:** React 18.2 + TypeScript (Components → Hooks → Contexts), React Router, Framer Motion, React Icons, React Slick, React Calendar
* **Testing:** Jest + Supertest (backend), Jest + RTL (frontend), Cypress (E2E), MSW (API mocks), MongoDB Memory Server (DB tests)
* **Shared types:** `@topsmile/types` — verify usage, detect duplication

---

## Deliverables (bundle in a ZIP or commit-like archive)

1. **`TOPSMILE_REVIEW.md`** — main structured Markdown report (see below).
2. **`patches/`** — git unified diffs for concrete fixes, with motivation and risk annotations.
3. **`issues.json`** — machine-readable list of findings (`id, title, severity, area, file, lineRange, description, reproduction, suggestedFixPatchRef, testsSuggested, confidence`).
4. **`files_reviewed.txt`** — canonical list of reviewed files, with skipped/auto-generated ones annotated.
5. **`tests_to_add.md`** — explicit test snippets (Jest, RTL, Supertest, or Cypress) for high-risk flows.

---

## `TOPSMILE_REVIEW.md` structure (use this exact top-level order)

1. Title & TOC
2. Executive summary — one health sentence + top 3 action items
3. Quick issues table — `ID | Short title | Severity | Area | File(s) | Patch?`
4. Architecture overview — short flow description + Mermaid diagram + global cross-cutting concerns
5. Correctness & logic issues — backend & frontend (with repro, patch, test)
6. API contract & integration map — endpoint table + frontend→backend mapping + mismatches & fixes
7. Frontend–Backend integration risks — short-/medium-term fixes
8. Performance & scalability — backend queries/indexes + frontend render/network optimizations
9. UI/UX & Accessibility — focus, aria, contrast, keyboard navigation, animations
10. Error handling & feedback loops — backend error format + frontend surfacing
11. Database & schema review — Mongoose models, validators, indexes, risky fields
12. Testing & QA — coverage gaps + example test snippets
13. Dependencies & vulnerabilities — outdated/insecure packages + safer alternatives
14. Code quality & maintainability — TypeScript issues, hook anti-patterns, duplication, prop drilling
15. Observability & monitoring — logging, error reporting, tracing recommendations
16. Migration strategy (shared types) — short/medium/long-term plan + example diffs
17. Prioritized TODO list — top 9 improvements by severity & difficulty (Small/Medium/Large)
18. Files examined — canonical file list with skip notes
19. Assumptions & confidence — confidence levels + explicit assumptions

---

## Patch & diff guidelines

* Format: **git unified diff** (`diff --git a/... b/...`).
* Each patch must include:

  * **Title**
  * **Motivation**
  * **Risk & regression window**
* Keep patches minimal, scoped, and test-covered.

---

## Severity levels

* **Critical** — exploitable vulnerabilities, data loss, or breakage of core flows
* **High** — correctness or security flaws threatening data/core features
* **Medium** — performance, robustness, or maintainability problems
* **Low** — style, consistency, or minor issues

---

## Reporting style

* Concise, actionable, and consistent.
* Prefer **small code diffs + examples** over verbose prose.
* Explicitly label any assumption or guess.
* Use `file:lineStart-lineEnd` for references.
* Keep code snippets ≤ 80 lines.
* Only use **one Mermaid diagram** (architecture flow).

---

## Acceptance criteria

* All deliverables present (`TOPSMILE_REVIEW.md`, `issues.json`, `patches/`, `files_reviewed.txt`, `tests_to_add.md`).
* Critical/High issues include **ready-to-apply patches** with repro + test suggestions.
* Findings mapped to only the provided raw GitHub files (no external assumptions).

---

