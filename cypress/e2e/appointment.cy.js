describe('Appointment Scheduling', () => {
  beforeEach(() => {
    // Assume user is logged in
    cy.visit('/calendar');
  });

  it('should display calendar', () => {
    cy.get('[data-cy="calendar"]').should('be.visible');
  });

  it('should allow scheduling new appointment', () => {
    cy.get('[data-cy="new-appointment-button"]').click();
    cy.get('[data-cy="patient-select"]').select('John Doe');
    cy.get('[data-cy="date-input"]').type('2024-12-01');
    cy.get('[data-cy="time-input"]').type('10:00');
    cy.get('[data-cy="save-appointment-button"]').click();

    cy.get('[data-cy="success-message"]').should('be.visible');
  });

  it('should show existing appointments', () => {
    cy.get('[data-cy="appointment-item"]').should('have.length.greaterThan', 0);
  });
});
