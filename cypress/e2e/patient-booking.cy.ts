export {};
/// <reference types="cypress" />

describe('Patient Appointment Booking E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    // Assume patient is logged in
    cy.visit('/patient/appointments/new');
  });

  it('should book appointment successfully', () => {
    // Select provider
    cy.get('[data-testid=provider-select]').select('Dr. Smith');

    // Select appointment type
    cy.get('[data-testid=appointment-type-select]').select('Consultation');

    // Select date
    cy.get('[data-testid=date-input]').type('2024-12-01');

    // Wait for time slots to load and select one
    cy.get('[data-testid=time-slot-10:00]').click();

    // Add notes
    cy.get('[data-testid=notes-textarea]').type('First consultation');

    // Confirm booking
    cy.get('[data-testid=confirm-booking-button]').click();

    // Should show success message and redirect
    cy.get('[data-testid=success-message]')
      .should('contain', 'Consulta agendada com sucesso!');
    cy.url().should('include', '/patient/appointments');
  });

  it('should handle booking conflicts', () => {
    // Select provider
    cy.get('[data-testid=provider-select]').select('Dr. Smith');

    // Select appointment type
    cy.get('[data-testid=appointment-type-select]').select('Consultation');

    // Select date
    cy.get('[data-testid=date-input]').type('2024-12-01');

    // Select time slot
    cy.get('[data-testid=time-slot-10:00]').click();

    // Confirm booking
    cy.get('[data-testid=confirm-booking-button]').click();

    // Should show error message
    cy.get('[data-testid=error-message]')
      .should('contain', 'Horário não disponível');
  });

  it('should validate required fields', () => {
    // Try to submit without selecting provider
    cy.get('[data-testid=confirm-booking-button]').click();

    // Should show validation error
    cy.get('[data-testid=validation-error]')
      .should('contain', 'Selecione um dentista');

    // Select provider but no date
    cy.get('[data-testid=provider-select]').select('Dr. Smith');
    cy.get('[data-testid=confirm-booking-button]').click();

    // Should show date validation error
    cy.get('[data-testid=validation-error]')
      .should('contain', 'Selecione uma data');
  });
});
