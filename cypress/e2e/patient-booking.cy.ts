export {};
/// <reference types="cypress" />

describe('Patient Appointment Booking E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/patient/login');
    cy.get('[data-testid=email-input]').type('patient@test.com');
    cy.get('[data-testid=password-input]').type('PatientPass123!');
    cy.get('[data-testid=login-button]').click();
    cy.url().should('include', '/patient/dashboard');
    cy.visit('/patient/appointments/new');
  });

  it('should load booking form', () => {
    cy.get('[data-testid=provider-select]').should('be.visible');
    cy.get('[data-testid=appointment-type-select]').should('be.visible');
    cy.get('[data-testid=date-input]').should('be.visible');
  });

  it('should book appointment successfully', () => {
    cy.get('[data-testid=provider-select]').select('Dr. Smith');
    cy.get('[data-testid=appointment-type-select]').select('Consultation');
    cy.get('[data-testid=date-input]').type('2024-12-01');
    cy.get('[data-testid=time-slot]').first().click();
    cy.get('[data-testid=notes-textarea]').type('First consultation');
    cy.get('[data-testid=confirm-booking-button]').click();
    cy.get('[data-testid=success-message]', { timeout: 10000 })
      .should('be.visible');
    cy.url().should('include', '/patient/appointments');
  });

  it('should validate required fields', () => {
    cy.get('[data-testid=confirm-booking-button]').click();
    cy.get('[data-testid=validation-error]').should('be.visible');
  });

  it('should show available time slots', () => {
    cy.get('[data-testid=provider-select]').select('Dr. Smith');
    cy.get('[data-testid=date-input]').type('2024-12-01');
    cy.get('[data-testid=time-slot]', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('should cancel booking', () => {
    cy.get('[data-testid=cancel-button]').click();
    cy.url().should('include', '/patient/dashboard');
  });

  it('should view appointment details after booking', () => {
    cy.get('[data-testid=provider-select]').select('Dr. Smith');
    cy.get('[data-testid=appointment-type-select]').select('Consultation');
    cy.get('[data-testid=date-input]').type('2024-12-01');
    cy.get('[data-testid=time-slot]').first().click();
    cy.get('[data-testid=confirm-booking-button]').click();
    cy.url().should('include', '/patient/appointments');
    cy.get('[data-testid=appointment-card]').first().click();
    cy.url().should('match', /\/patient\/appointments\/[a-f0-9]+/);
  });
});
