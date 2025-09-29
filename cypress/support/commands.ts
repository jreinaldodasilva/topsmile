
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type(email);
    cy.get('[data-testid=password-input]').type(password);
    cy.get('[data-testid=login-button]').click();
    cy.url().should('include', '/admin');
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

export {};
