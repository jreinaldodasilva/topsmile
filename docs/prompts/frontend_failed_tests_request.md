**Improved Prompt (Detailed & Structured):**

"Review the test results in `reports/junit-frontend.xml` and generate a Markdown document named `docs/frontend_failed_tests.md`. The document must contain **only the failed tests** and follow this structure:

1. **Title**

   * Use `# Frontend Failed Tests` as the main heading.

2. **Summary Section**

   * At the top, include a short summary with:

     * Total number of failed tests.
     * Total number of tests executed.

3. **Failed Test Details**
   For each failed test, include a section with:

   * Test name (as a level 2 heading, e.g., `## Test: <test_name>`)
   * File or class (if available).
   * Error message (formatted as a blockquote).
   * Stack trace (if present, inside a fenced code block for readability).

4. **Formatting Requirements**

   * Use proper Markdown headings and formatting.
   * Ensure error messages and stack traces are easy to read.
   * Do not include passed or skipped tests.

The final document should serve as a clear reference for developers to quickly identify and debug frontend test failures."

