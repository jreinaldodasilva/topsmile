describe('Error Handling', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should display a 404 page for a non-existent route', () => {
    cy.visit('/non-existent-page');
    cy.get('[data-cy="not-found-page"]').should('be.visible');
  });

  it('should display an error boundary when a component crashes', () => {
    // We need a way to force a component to crash. 
    // For this test, we can add a special route that renders a component that throws an error.
    cy.visit('/test-components');
    cy.get('[data-cy="crash-button"]').click();
    cy.get('[data-cy="error-boundary"]').should('be.visible');
  });
});
