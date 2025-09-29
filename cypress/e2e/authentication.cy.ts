/// <reference types="cypress" />

describe('Authentication E2E Flow', () => {

  it('should complete login flow', () => {
    cy.login('admin@topsmile.com', 'SecurePass123!');
    // Should redirect to dashboard
    cy.url().should('include', '/admin');
    cy.get('[data-testid=dashboard-title]').should('contain', 'Dashboard');

    // Should store tokens
    cy.window().its('localStorage')
      .invoke('getItem', 'topsmile_access_token')
      .should('exist');
  });

  it('should handle login failure', () => {
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type('wrong@email.com');
    cy.get('[data-testid=password-input]').type('wrongpassword');
    cy.get('[data-testid=login-button]').click();

    cy.get('[data-testid=error-message]')
      .should('be.visible')
      .and('contain', 'E-mail ou senha inválidos');
  });

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login('admin@topsmile.com', 'SecurePass123!');
      cy.visit('/admin');
    });

    it('should handle logout', () => {
      // Logout
      cy.get('[data-testid=user-menu]').click();
      cy.get('[data-testid=logout-button]').click();

      // Should redirect to login
      cy.url().should('include', '/login');

      // Tokens should be cleared
      cy.window().its('localStorage')
        .invoke('getItem', 'topsmile_access_token')
        .should('not.exist');
    });
  });
});
