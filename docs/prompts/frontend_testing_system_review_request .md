# Frontend Testing System Review Prompt

Please conduct a comprehensive review of the frontend testing infrastructure for this dental clinic management system (React 18 + TypeScript), evaluating it across the following areas:

## 1. Test Coverage & Strategy
- What types of tests are implemented (unit, integration, e2e with Cypress)?
- Are critical user workflows adequately covered (appointment booking, patient registration, payment flows)?
- Should there be specific coverage thresholds for components, hooks, and utilities?
- Are there gaps in testing accessibility, responsive design, or cross-browser compatibility?
- Should visual regression testing be implemented for UI consistency?

## 2. Testing Framework & Tools
- Is the Testing Library approach appropriate for this React application?
- Should there be additional tools (MSW for API mocking, React Testing Library utilities)?
- Are there proper testing utilities for TanStack Query and async state management?
- Should there be testing tools for Framer Motion animations?
- Is Cypress configured optimally for e2e tests, or should Playwright be considered?

## 3. Component Testing
- Are presentational and container components tested separately?
- Should there be tests for all user interactions (clicks, form inputs, navigation)?
- Are loading states, error states, and empty states tested?
- Should there be tests for conditional rendering and dynamic content?
- Are component prop variations and edge cases covered?

## 4. Hooks & Custom Logic Testing
- Are custom React hooks tested in isolation?
- Should there be tests for TanStack Query hooks (queries, mutations, cache behavior)?
- Are context providers and state management thoroughly tested?
- Should there be tests for side effects and cleanup functions?

## 5. Integration & E2E Testing
- Which user journeys should have full e2e coverage with Cypress?
- Should there be tests for the complete appointment booking flow?
- Are authentication flows (login, logout, session management) tested end-to-end?
- Should there be tests for role-based access (admin, manager, staff views)?
- Are payment flows with Stripe integration tested (test mode)?

## 6. API Mocking & Data Management
- How should API calls be mocked in tests (MSW, manual mocks)?
- Should there be fixture data for common scenarios (appointments, patients, providers)?
- Are error responses and network failures tested?
- Should there be tests for optimistic updates and cache invalidation?
- How should WebSocket or real-time features be tested?

## 7. Accessibility & UX Testing
- Should there be automated accessibility tests (jest-axe, pa11y)?
- Are keyboard navigation and screen reader compatibility tested?
- Should there be tests for ARIA attributes and semantic HTML?
- Are form validations and error messages accessible?
- Should there be tests for focus management in modals and dialogs?

## 8. Performance & Optimization
- Should there be performance testing for component rendering?
- Are code splitting and lazy loading scenarios tested?
- Should there be tests for memory leaks in long-lived components?
- Are large lists and pagination properly tested?
- Should there be bundle size monitoring?

## 9. Localization & User Experience
- Since user-facing messages are in Portuguese, are translations tested?
- Should there be tests for date/time formatting and timezone handling?
- Are currency and number formats (Brazilian Real) tested?
- Should there be tests for different user preferences and settings?

## 10. Test Organization & Structure
- How should tests be organized (co-located, separate directories)?
- Are there clear naming conventions (*.test.tsx, *.spec.tsx)?
- Should there be shared test utilities and custom render functions?
- Is there a setup file for global test configuration?
- Should there be test categorization (smoke, regression, critical path)?

## 11. State Management & Side Effects
- Are Redux/Context state changes properly tested?
- Should there be tests for race conditions and concurrent updates?
- Are API cache invalidation scenarios tested?
- Should there be tests for browser storage (localStorage, sessionStorage)?
- Are navigation and routing changes tested?

## 12. Security Testing
- Should there be tests for XSS prevention and input sanitization?
- Are authentication tokens properly handled in tests?
- Should there be tests for sensitive data masking (patient info, payment details)?
- Are CSRF protection mechanisms tested?
- Should there be tests for session timeout and re-authentication?

## 13. Responsive & Cross-Browser Testing
- Should there be viewport testing for mobile, tablet, and desktop?
- Are touch interactions and mobile gestures tested?
- Should there be browser compatibility tests?
- Are print styles and PDF generation features tested?

## 14. Error Boundaries & Fallbacks
- Are React Error Boundaries tested?
- Should there be tests for graceful degradation?
- Are offline scenarios and network errors handled?
- Should there be tests for fallback UI components?

## 15. CI/CD & Automation
- What test commands should be available (watch, coverage, ci)?
- Should tests run in parallel for faster feedback?
- Are there pre-commit hooks with Husky/lint-staged?
- Should there be visual regression tests in CI?
- How should test reports be generated and stored?

## 16. Documentation & Developer Experience
- Should there be a testing guide with examples?
- Are complex test scenarios documented?
- Should there be templates for common test patterns?
- Is there guidance on when to use unit vs integration vs e2e tests?
- Should there be best practices for testing async operations?

## Deliverables Requested

Please provide:
1. **Gap Analysis**: Identify missing test types and critical untested scenarios
2. **Tool Recommendations**: Suggest specific libraries and configurations
3. **Test Structure Example**: Provide a sample test file showing best practices
4. **E2E Test Suite**: Recommend priority user flows for Cypress
5. **Testing Checklist**: Create a checklist for new feature testing
6. **Sample Code**: Include examples for testing:
   - Complex forms with validation
   - Appointment scheduling component
   - Payment integration (Stripe Elements)
   - Provider dashboard with real-time updates
   - Patient search and filtering
7. **CI/CD Integration**: Suggest GitHub Actions or similar workflow
8. **Performance Benchmarks**: Recommend metrics to track

Focus particularly on healthcare-specific considerations, HIPAA compliance UI requirements, and ensuring patient data is handled securely in all test scenarios.