export {};
/// <reference types="cypress" />

describe('Authentication E2E Flow', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should complete admin login flow', () => {
    cy.login('admin@topsmile.com', 'SecurePass123!');
    cy.url().should('include', '/admin');
    cy.get('[data-testid=dashboard-title]').should('contain', 'Dashboard');
    cy.window().its('localStorage')
      .invoke('getItem', 'topsmile_access_token')
      .should('exist');
  });

  it('should complete patient login flow', () => {
    cy.visit('/patient/login');
    cy.get('[data-testid=email-input]').type('patient@test.com');
    cy.get('[data-testid=password-input]').type('PatientPass123!');
    cy.get('[data-testid=login-button]').click();
    cy.url().should('include', '/patient/dashboard');
  });

  it('should handle invalid credentials', () => {
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type('wrong@email.com');
    cy.get('[data-testid=password-input]').type('wrongpassword');
    cy.get('[data-testid=login-button]').click();
    cy.get('[data-testid=error-message]', { timeout: 10000 })
      .should('be.visible');
  });

  it('should validate email format', () => {
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type('invalid-email');
    cy.get('[data-testid=password-input]').type('password');
    cy.get('[data-testid=login-button]').click();
    cy.get('[data-testid=email-input]').should('have.attr', 'aria-invalid', 'true');
  });

  it('should require password', () => {
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type('test@test.com');
    cy.get('[data-testid=login-button]').click();
    cy.get('[data-testid=password-input]').should('have.attr', 'aria-invalid', 'true');
  });

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login('admin@topsmile.com', 'SecurePass123!');
      cy.visit('/admin');
    });

    it('should handle logout', () => {
      cy.get('[data-testid=user-menu]').click();
      cy.get('[data-testid=logout-button]').click();
      cy.url().should('include', '/login');
      cy.window().its('localStorage')
        .invoke('getItem', 'topsmile_access_token')
        .should('not.exist');
    });

    it('should persist session on page reload', () => {
      cy.reload();
      cy.url().should('include', '/admin');
      cy.window().its('localStorage')
        .invoke('getItem', 'topsmile_access_token')
        .should('exist');
    });

    it('should redirect to login on token expiry', () => {
      cy.window().then((win) => {
        win.localStorage.removeItem('topsmile_access_token');
      });
      cy.visit('/admin/patients');
      cy.url().should('include', '/login');
    });
  });
});
