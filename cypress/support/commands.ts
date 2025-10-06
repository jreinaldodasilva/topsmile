Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type(email);
    cy.get('[data-testid=password-input]').type(password);
    cy.get('[data-testid=login-button]').click();
    cy.url().should('include', '/admin');
  });
});

Cypress.Commands.add('patientLogin', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/patient/login');
    cy.get('[data-testid=email-input]').type(email);
    cy.get('[data-testid=password-input]').type(password);
    cy.get('[data-testid=login-button]').click();
    cy.url().should('include', '/patient/dashboard');
  });
});

Cypress.Commands.add('createPatient', (patientData) => {
  cy.get('[data-testid=add-patient-button]').click();
  cy.get('[data-testid=patient-name-input]').type(patientData.name);
  cy.get('[data-testid=patient-email-input]').type(patientData.email);
  cy.get('[data-testid=patient-phone-input]').type(patientData.phone);
  cy.get('[data-testid=save-patient-button]').click();
  cy.get('[data-testid=success-message]', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('waitForApiCall', (alias) => {
  cy.wait(alias, { timeout: 10000 });
});

Cypress.Commands.add('checkAccessibility', () => {
  cy.get('[role=alert]').should('have.attr', 'aria-live');
  cy.get('button').each(($btn) => {
    cy.wrap($btn).should('have.attr', 'aria-label').or('have.text');
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      patientLogin(email: string, password: string): Chainable<void>;
      createPatient(patientData: { name: string; email: string; phone: string }): Chainable<void>;
      waitForApiCall(alias: string): Chainable<void>;
      checkAccessibility(): Chainable<void>;
    }
  }
}

export {};
