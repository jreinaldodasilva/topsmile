export {};
/// <reference types="cypress" />

describe('Critical User Flows', () => {
  
  describe('Admin: Patient Management Flow', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.login('admin@topsmile.com', 'SecurePass123!');
      cy.visit('/admin/patients');
    });

    it('should create new patient', () => {
      cy.get('[data-testid=add-patient-button]').click();
      cy.get('[data-testid=patient-name-input]').type('João Silva');
      cy.get('[data-testid=patient-email-input]').type('joao@test.com');
      cy.get('[data-testid=patient-phone-input]').type('(11) 98765-4321');
      cy.get('[data-testid=save-patient-button]').click();
      cy.get('[data-testid=success-message]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid=patient-list]').should('contain', 'João Silva');
    });

    it('should search for patient', () => {
      cy.get('[data-testid=search-input]').type('João');
      cy.get('[data-testid=patient-list]').should('contain', 'João');
    });

    it('should view patient details', () => {
      cy.get('[data-testid=patient-card]').first().click();
      cy.url().should('match', /\/admin\/patients\/[a-f0-9]+/);
      cy.get('[data-testid=patient-details]').should('be.visible');
    });
  });

  describe('Admin: Appointment Management Flow', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.login('admin@topsmile.com', 'SecurePass123!');
      cy.visit('/admin/appointments');
    });

    it('should view calendar', () => {
      cy.get('[data-testid=calendar-view]').should('be.visible');
      cy.get('[data-testid=calendar-date]').should('be.visible');
    });

    it('should create appointment', () => {
      cy.get('[data-testid=add-appointment-button]').click();
      cy.get('[data-testid=patient-select]').select(1);
      cy.get('[data-testid=provider-select]').select(1);
      cy.get('[data-testid=date-input]').type('2024-12-01');
      cy.get('[data-testid=time-input]').type('10:00');
      cy.get('[data-testid=save-appointment-button]').click();
      cy.get('[data-testid=success-message]', { timeout: 10000 }).should('be.visible');
    });

    it('should filter appointments by date', () => {
      cy.get('[data-testid=date-filter]').type('2024-12-01');
      cy.get('[data-testid=apply-filter-button]').click();
      cy.get('[data-testid=appointment-list]').should('be.visible');
    });
  });

  describe('Patient: Complete Booking Flow', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.visit('/patient/login');
      cy.get('[data-testid=email-input]').type('patient@test.com');
      cy.get('[data-testid=password-input]').type('PatientPass123!');
      cy.get('[data-testid=login-button]').click();
      cy.url().should('include', '/patient/dashboard');
    });

    it('should complete full booking flow', () => {
      // Navigate to booking
      cy.get('[data-testid=book-appointment-button]').click();
      cy.url().should('include', '/patient/appointments/new');

      // Select provider
      cy.get('[data-testid=provider-select]').select('Dr. Smith');

      // Select date
      cy.get('[data-testid=date-input]').type('2024-12-15');

      // Wait for slots and select
      cy.get('[data-testid=time-slot]', { timeout: 10000 }).first().click();

      // Confirm
      cy.get('[data-testid=confirm-booking-button]').click();

      // Verify success
      cy.get('[data-testid=success-message]', { timeout: 10000 }).should('be.visible');
      cy.url().should('include', '/patient/appointments');

      // View appointment
      cy.get('[data-testid=appointment-card]').first().should('be.visible');
    });

    it('should view appointment history', () => {
      cy.visit('/patient/appointments');
      cy.get('[data-testid=appointment-list]').should('be.visible');
      cy.get('[data-testid=appointment-card]').should('have.length.greaterThan', 0);
    });

    it('should update profile', () => {
      cy.visit('/patient/profile');
      cy.get('[data-testid=phone-input]').clear().type('(11) 99999-9999');
      cy.get('[data-testid=save-profile-button]').click();
      cy.get('[data-testid=success-message]', { timeout: 10000 }).should('be.visible');
    });
  });

  describe('Error Recovery Flow', () => {
    it('should recover from network error', () => {
      cy.intercept('GET', '/api/appointments*', { forceNetworkError: true }).as('networkError');
      cy.login('admin@topsmile.com', 'SecurePass123!');
      cy.visit('/admin/appointments');
      cy.get('[data-testid=error-message]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid=retry-button]').click();
      cy.get('[data-testid=calendar-view]', { timeout: 10000 }).should('be.visible');
    });

    it('should handle session expiry', () => {
      cy.login('admin@topsmile.com', 'SecurePass123!');
      cy.visit('/admin');
      cy.window().then((win) => {
        win.localStorage.removeItem('topsmile_access_token');
      });
      cy.visit('/admin/patients');
      cy.url().should('include', '/login');
    });
  });
});
