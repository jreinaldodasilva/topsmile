export {};
/// <reference types="cypress" />

describe('Regression Tests', () => {

  describe('Navigation', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.login('admin@topsmile.com', 'SecurePass123!');
    });

    it('should navigate between admin pages', () => {
      cy.visit('/admin');
      cy.get('[data-testid=nav-patients]').click();
      cy.url().should('include', '/admin/patients');
      
      cy.get('[data-testid=nav-appointments]').click();
      cy.url().should('include', '/admin/appointments');
      
      cy.get('[data-testid=nav-providers]').click();
      cy.url().should('include', '/admin/providers');
    });

    it('should handle browser back button', () => {
      cy.visit('/admin/patients');
      cy.visit('/admin/appointments');
      cy.go('back');
      cy.url().should('include', '/admin/patients');
    });

    it('should preserve state on navigation', () => {
      cy.visit('/admin/patients');
      cy.get('[data-testid=search-input]').type('Test');
      cy.visit('/admin/appointments');
      cy.go('back');
      cy.get('[data-testid=search-input]').should('have.value', 'Test');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.login('admin@topsmile.com', 'SecurePass123!');
    });

    it('should validate patient form', () => {
      cy.visit('/admin/patients');
      cy.get('[data-testid=add-patient-button]').click();
      cy.get('[data-testid=save-patient-button]').click();
      cy.get('[data-testid=validation-error]').should('be.visible');
    });

    it('should validate email format', () => {
      cy.visit('/admin/patients');
      cy.get('[data-testid=add-patient-button]').click();
      cy.get('[data-testid=patient-email-input]').type('invalid-email');
      cy.get('[data-testid=save-patient-button]').click();
      cy.get('[data-testid=patient-email-input]').should('have.attr', 'aria-invalid', 'true');
    });

    it('should validate phone format', () => {
      cy.visit('/admin/patients');
      cy.get('[data-testid=add-patient-button]').click();
      cy.get('[data-testid=patient-phone-input]').type('123');
      cy.get('[data-testid=save-patient-button]').click();
      cy.get('[data-testid=patient-phone-input]').should('have.attr', 'aria-invalid', 'true');
    });
  });

  describe('Data Persistence', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.login('admin@topsmile.com', 'SecurePass123!');
    });

    it('should persist created patient', () => {
      cy.visit('/admin/patients');
      cy.get('[data-testid=add-patient-button]').click();
      cy.get('[data-testid=patient-name-input]').type('Regression Test');
      cy.get('[data-testid=patient-email-input]').type('regression@test.com');
      cy.get('[data-testid=patient-phone-input]').type('(11) 98765-4321');
      cy.get('[data-testid=save-patient-button]').click();
      cy.get('[data-testid=success-message]', { timeout: 10000 }).should('be.visible');
      
      cy.reload();
      cy.get('[data-testid=search-input]').type('Regression Test');
      cy.get('[data-testid=patient-list]').should('contain', 'Regression Test');
    });

    it('should persist appointment changes', () => {
      cy.visit('/admin/appointments');
      cy.get('[data-testid=appointment-card]').first().click();
      cy.get('[data-testid=edit-button]').click();
      cy.get('[data-testid=notes-textarea]').type('Updated notes');
      cy.get('[data-testid=save-button]').click();
      cy.get('[data-testid=success-message]', { timeout: 10000 }).should('be.visible');
      
      cy.reload();
      cy.get('[data-testid=appointment-notes]').should('contain', 'Updated notes');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors', () => {
      cy.visit('/admin/nonexistent-page', { failOnStatusCode: false });
      cy.url().should('include', '/');
    });

    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '/api/patients*', { statusCode: 500 }).as('serverError');
      cy.login('admin@topsmile.com', 'SecurePass123!');
      cy.visit('/admin/patients');
      cy.get('[data-testid=error-message]', { timeout: 10000 }).should('be.visible');
    });

    it('should show loading states', () => {
      cy.intercept('GET', '/api/appointments*', (req) => {
        req.reply((res) => {
          res.delay = 2000;
        });
      }).as('slowRequest');
      cy.login('admin@topsmile.com', 'SecurePass123!');
      cy.visit('/admin/appointments');
      cy.get('[data-testid=loading-spinner]').should('be.visible');
      cy.wait('@slowRequest');
      cy.get('[data-testid=loading-spinner]').should('not.exist');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.login('admin@topsmile.com', 'SecurePass123!');
    });

    it('should support keyboard navigation', () => {
      cy.visit('/admin/patients');
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid');
    });

    it('should have proper ARIA labels', () => {
      cy.visit('/admin/patients');
      cy.get('[data-testid=add-patient-button]').should('have.attr', 'aria-label');
      cy.get('[data-testid=search-input]').should('have.attr', 'aria-label');
    });

    it('should announce errors to screen readers', () => {
      cy.visit('/login');
      cy.get('[data-testid=login-button]').click();
      cy.get('[role=alert]').should('exist');
    });
  });

  describe('Performance', () => {
    it('should load pages within acceptable time', () => {
      const startTime = Date.now();
      cy.login('admin@topsmile.com', 'SecurePass123!');
      cy.visit('/admin/patients');
      cy.get('[data-testid=patient-list]', { timeout: 5000 }).should('be.visible');
      cy.then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(5000);
      });
    });

    it('should handle large datasets', () => {
      cy.login('admin@topsmile.com', 'SecurePass123!');
      cy.visit('/admin/appointments');
      cy.get('[data-testid=calendar-view]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid=appointment-card]').should('have.length.greaterThan', 0);
    });
  });
});
