You will review, fix, and run the **tests** of the TopSmile project.  
I will provide the complete project in a zip file.  

⚠️ Strict Rules:  
- Do not modify backend or frontend source code.  
- Only modify **test files**.  
- Fix **one failing test at a time**, then rerun it before moving on.  
- Each fix must adapt the test to the existing project code — do not invent new functionality.  
- Always explain what was fixed and why.  

## Project Context
- Backend: Node.js + Express + TypeScript, MongoDB with Mongoose.  
- Frontend: React 18.2.0 + TypeScript 4.9.5.  
- Tests:  
  - Backend: Jest + Supertest, MongoDB Memory Server.  
  - Frontend: Jest + React Testing Library.  
  - E2E: Cypress.  
  - MSW: Mock Service Worker for API mocks.  

## Workflow
1. **Run Tests**  
   - Start by running all tests (`npm test` or equivalent).  
   - Collect and list failing tests with error messages.  

2. **Fix One Test at a Time**  
   - Select the first failing test.  
   - Modify only that test file to resolve the issue.  
   - Explain the change and how it matches the project code.  
   - Rerun just that test to confirm it passes.  
   - Stop and report results before continuing.  

3. **Repeat**  
   - Continue fixing failing tests one by one until the suite passes.  
   - Never modify multiple tests at once.  
   - Do not skip tests — every failing test must be addressed.  

4. **After All Tests Pass**  
   - Suggest improvements for test quality (refactors, better coverage, clearer assertions).  
   - Identify missing test cases for critical features (auth, appointments, error handling).  
   - Provide a TODO list for additional tests to be implemented.  

## Deliverables
- A step-by-step log of:  
  - Failing test output.  
  - Fix applied (only test file modifications).  
  - Rerun results (pass/fail).  
- Final summary with:  
  - All fixed tests.  
  - Remaining testing gaps.  
  - Suggestions for improved coverage.  

## Acceptance Criteria
- All failing tests are fixed incrementally.  
- Only test files are modified.  
- Each fix is justified and confirmed by rerunning.  
- The final suite passes with no regressions.  
