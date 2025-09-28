**Improved Prompt (Detailed & Structured):**

"Review the test results in `junit-frontend.xml` and generate a Markdown document named `frontend_failedtests.md`. The document must contain **only the failed tests** and follow this structure:

---

### 1. Title

* Use `# Frontend Failed Tests` as the main heading.

---

### 2. Summary Section

At the top of the document, include a short summary with:

* Total number of failed tests.
* Total number of tests executed.
* Number of test suites affected.

---

### 3. Organization by Test Suite

* Group failed tests **by their test suite**.
* Each suite should be a level 2 heading (e.g., `## Test Suite: <suite_name>`).

---

### 4. Failed Test Details

For each failed test inside a suite, include:

* **Test name** (as a level 3 heading, e.g., `### Test: <test_name>`)
* **File or class** (if available).
* **Error message** (formatted as a blockquote).
* **Stack trace** (if present, inside a fenced code block for readability).

---

### 5. Formatting Requirements

* Use proper Markdown headings for hierarchy (suites → tests).
* Ensure error messages and stack traces are easy to read.
* Include **only failed tests** (exclude passed or skipped tests).

---

The final Markdown document should provide developers with a clear, well-structured reference for identifying and debugging frontend test failures."
