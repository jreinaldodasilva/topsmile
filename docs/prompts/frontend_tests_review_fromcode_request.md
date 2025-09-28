# Prompt: Frontend Test Review & Fixes

Thoroughly and meticulously perform a **static review of the frontend test suite** for the TopSmile project using only the inputs provided.

⚠️ Important: Do **not** use any cached knowledge or prior memory about this project.

---

## Primary goals

1. Verify **correctness, reliability, coverage,** and **maintainability** of all frontend tests.
2. Ensure that tests align with the actual **frontend code behavior** (components, hooks, contexts, and API integrations).
3. Deliver a prioritized, actionable remediation plan with concrete **patches/diffs**, suggested **tests**, and clear reproduction steps for each failing or missing case.

---

## Project context

* **Frontend stack:** React 18.2.0 + TypeScript (Components → Hooks → Contexts), React Router, Framer Motion, React Icons, React Slick, React Calendar.
* **Testing stack:** Jest + React Testing Library, Cypress (E2E), MSW (API mocks).
* **Shared types:** `@topsmile/types` — ensure test coverage aligns with type usage.

---

## Hard constraints

* **Do not access secrets** (.env, private keys). If files reference secrets, mark as "security observation — references to secret".
* When assumptions are required, explicitly label them as `ASSUMPTION:` in the report.

---

## Required deliverables

Produce a single ZIP (or commit-like bundle) containing:

1. `FRONTEND_TEST_REVIEW.md` — the main Markdown report. It **must** include the sections listed below.
2. `patches/` — one or more git-style unified diffs (`.patch`) with fixes for failing or missing tests. Each must include a short header with motivation and risk.
3. `issues.json` — machine-readable list of all findings (id, title, severity, file, lineRange, description, reproduction, suggestedFixPatchRef, testsSuggested, confidence).
4. `files_reviewed.txt` — canonical list of all frontend test files scanned (skip third-party/auto-generated with reason).
5. `tests_to_add.md` — concrete Jest/RTL or Cypress snippets for untested or under-tested flows.

---

## `FRONTEND_TEST_REVIEW.md` required structure

1. **Title & TOC**
2. **Executive summary (1 paragraph)**

   * One overall health sentence + top 3 action items.
3. **Quick issues table**

   * Columns: `ID | Short title | Severity | File(s) | Patch? (Y/N)`.
4. **Test suite overview**

   * Short description of test organization (unit, integration, E2E).
   * Diagram (Mermaid) showing test layering: `Component → Hook/Context → API Mock → User Interaction (RTL/Cypress)`.
5. **Correctness & reliability issues**

   * Misaligned assertions, flaky patterns, missing cleanup, over-mocking.
   * Provide code references, reproduction steps, patches, and suggested regression tests.
6. **Coverage gaps**

   * Identify critical flows not tested (auth, navigation, forms, async API handling).
   * Provide Jest/RTL or Cypress snippets to fill gaps.
7. **Integration risks**

   * Check alignment of MSW mocks vs API contracts.
   * Flag mismatches and propose fixes (adapter, updated mocks, type imports).
8. **Performance in tests**

   * Over-rendering, excessive async waits, non-isolated setups.
   * Suggest optimizations (test utils, mock strategies).
9. **Maintainability & readability**

   * Highlight duplicated patterns, unclear naming, brittle selectors.
   * Recommend improvements (custom render utils, test data factories).
10. **Accessibility (a11y) checks in tests**

* Ensure tests verify focus, aria labels, keyboard flows where relevant.
* Provide test snippet examples.

11. **Dependencies & vulnerabilities**

* Note outdated/insecure test dependencies (e.g., RTL/Jest versions).

12. **Prioritized TODO list**

* Top 9 improvements ordered by severity + difficulty (Small/Medium/Large).

13. **Files examined**

* `files_reviewed.txt` content with skipped files annotated.

14. **Assumptions & confidence**

* For each major finding, note confidence and any assumptions.

---

## Patch & diff guidelines

* Provide **minimal, scoped patches**.
* Each patch must include: `Title`, `Motivation`, `Risk & Regression windows`.
* Include a test addition or correction whenever possible.

---

## Severity definitions

* **Critical** — Tests missing for core flows (auth, scheduling, payments) or tests that give false positives/negatives.
* **High** — Flaky tests, incorrect mocks, major coverage gaps.
* **Medium** — Inefficient or redundant tests, maintainability issues.
* **Low** — Style, naming, readability.

---

## Acceptance criteria

* `FRONTEND_TEST_REVIEW.md` delivered with required structure.
* `issues.json` lists every finding.
* `patches/` contains fixes for every Critical/High issue.
* `tests_to_add.md` includes at least one test snippet for each uncovered high-risk flow.

