# E2E Testing Guide

## Overview

TopSmile uses Cypress for end-to-end testing. E2E tests verify complete user workflows from the browser perspective.

## Test Structure

```
cypress/
├── e2e/                          # Test specs
│   ├── authentication.cy.ts      # Login/logout flows
│   ├── patient-booking.cy.ts     # Patient appointment booking
│   ├── critical-flows.cy.ts      # Critical user journeys
│   ├── regression.cy.ts          # Regression test suite
│   ├── appointment.cy.js         # Appointment management
│   ├── error_handling.cy.js      # Error scenarios
│   └── performance.cy.ts         # Performance tests
├── support/                      # Support files
│   ├── commands.ts               # Custom commands
│   └── e2e.ts                    # Setup file
└── tsconfig.json                 # TypeScript config
```

## Running Tests

### Interactive Mode
```bash
npm run cy:open
```

### Headless Mode
```bash
npm run test:e2e
```

### Specific Test
```bash
npx cypress run --spec "cypress/e2e/authentication.cy.ts"
```

### With Browser
```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
```

## Test Categories

### 1. Authentication Tests (`authentication.cy.ts`)
- Admin login/logout
- Patient login/logout
- Invalid credentials
- Email validation
- Session persistence
- Token expiry

### 2. Patient Booking Tests (`patient-booking.cy.ts`)
- Load booking form
- Complete booking flow
- Field validation
- Time slot selection
- Booking cancellation
- View appointment details

### 3. Critical Flows (`critical-flows.cy.ts`)
- **Admin Patient Management**
  - Create patient
  - Search patient
  - View patient details

- **Admin Appointment Management**
  - View calendar
  - Create appointment
  - Filter appointments

- **Patient Complete Flow**
  - Full booking journey
  - View appointment history
  - Update profile

- **Error Recovery**
  - Network error recovery
  - Session expiry handling

### 4. Regression Tests (`regression.cy.ts`)
- **Navigation**
  - Page navigation
  - Browser back button
  - State preservation

- **Form Validation**
  - Required fields
  - Email format
  - Phone format

- **Data Persistence**
  - Created records persist
  - Updates persist

- **Error Handling**
  - 404 errors
  - API errors
  - Loading states

- **Accessibility**
  - Keyboard navigation
  - ARIA labels
  - Screen reader support

- **Performance**
  - Page load times
  - Large datasets

## Custom Commands

### login(email, password)
```typescript
cy.login('admin@topsmile.com', 'SecurePass123!');
```

### patientLogin(email, password)
```typescript
cy.patientLogin('patient@test.com', 'PatientPass123!');
```

### createPatient(patientData)
```typescript
cy.createPatient({
  name: 'João Silva',
  email: 'joao@test.com',
  phone: '(11) 98765-4321'
});
```

### waitForApiCall(alias)
```typescript
cy.intercept('GET', '/api/patients*').as('getPatients');
cy.waitForApiCall('@getPatients');
```

### checkAccessibility()
```typescript
cy.checkAccessibility();
```

## Best Practices

### 1. Use data-testid Attributes
```html
<button data-testid="login-button">Login</button>
```

```typescript
cy.get('[data-testid=login-button]').click();
```

### 2. Wait for Elements
```typescript
// Good
cy.get('[data-testid=success-message]', { timeout: 10000 })
  .should('be.visible');

// Avoid
cy.wait(5000); // Arbitrary waits
```

### 3. Use Aliases for API Calls
```typescript
cy.intercept('POST', '/api/appointments').as('createAppointment');
cy.get('[data-testid=save-button]').click();
cy.wait('@createAppointment');
```

### 4. Clean State Between Tests
```typescript
beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});
```

### 5. Use Sessions for Login
```typescript
// Reuses session across tests
cy.login('admin@topsmile.com', 'password');
```

## Writing New Tests

### Test Template
```typescript
export {};
/// <reference types="cypress" />

describe('Feature Name', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.login('admin@topsmile.com', 'SecurePass123!');
    cy.visit('/admin/feature');
  });

  it('should do something', () => {
    // Arrange
    cy.get('[data-testid=input]').type('value');
    
    // Act
    cy.get('[data-testid=submit-button]').click();
    
    // Assert
    cy.get('[data-testid=success-message]')
      .should('be.visible');
  });
});
```

## Debugging Tests

### 1. Use cy.debug()
```typescript
cy.get('[data-testid=element]').debug();
```

### 2. Use cy.pause()
```typescript
cy.pause(); // Pauses test execution
```

### 3. Check Screenshots
```
cypress/screenshots/
```

### 4. Check Videos
```
cypress/videos/
```

### 5. Use Browser DevTools
- Open Cypress in interactive mode
- Use browser DevTools
- Inspect elements and network

## CI/CD Integration

### GitHub Actions
Tests run automatically on:
- Push to main/develop
- Pull requests

### Configuration
```yaml
- name: Run Cypress tests
  uses: cypress-io/github-action@v6
  with:
    browser: chrome
    headed: false
    record: true
```

### Artifacts
- Screenshots (on failure)
- Videos (always)
- Test results

## Common Issues

### 1. Element Not Found
```typescript
// Add timeout
cy.get('[data-testid=element]', { timeout: 10000 });

// Wait for API
cy.intercept('GET', '/api/data').as('getData');
cy.wait('@getData');
```

### 2. Flaky Tests
```typescript
// Use retries
retries: {
  runMode: 2,
  openMode: 0,
}

// Use proper waits
cy.get('[data-testid=element]').should('be.visible');
```

### 3. Session Issues
```typescript
// Clear state
beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});
```

### 4. Timeout Errors
```typescript
// Increase timeout
cy.get('[data-testid=element]', { timeout: 30000 });

// Or in config
defaultCommandTimeout: 10000
```

## Test Data

### Use Fixtures
```typescript
cy.fixture('patient.json').then((patient) => {
  cy.createPatient(patient);
});
```

### Mock API Responses
```typescript
cy.intercept('GET', '/api/patients*', {
  fixture: 'patients.json'
}).as('getPatients');
```

## Performance Testing

### Measure Load Time
```typescript
const startTime = Date.now();
cy.visit('/admin/patients');
cy.get('[data-testid=patient-list]').should('be.visible');
cy.then(() => {
  const loadTime = Date.now() - startTime;
  expect(loadTime).to.be.lessThan(3000);
});
```

### Check Network Requests
```typescript
cy.intercept('GET', '/api/**').as('apiCalls');
cy.visit('/admin/patients');
cy.get('@apiCalls.all').should('have.length.lessThan', 10);
```

## Accessibility Testing

### Check ARIA Attributes
```typescript
cy.get('[data-testid=button]')
  .should('have.attr', 'aria-label');
```

### Check Keyboard Navigation
```typescript
cy.get('body').tab();
cy.focused().should('have.attr', 'data-testid', 'first-element');
```

### Check Screen Reader Announcements
```typescript
cy.get('[role=alert]').should('exist');
```

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [CI/CD Setup](./CI_CD_SETUP.md)
- [Testing Quick Reference](./TESTING_QUICK_REFERENCE.md)
