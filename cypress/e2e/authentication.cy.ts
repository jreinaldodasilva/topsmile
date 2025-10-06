describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully', () => {
    cy.get('input[type="email"]').type('admin@topsmile.com');
    cy.get('input[type="password"]').type('Admin123!');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/admin');
    cy.getCookie('accessToken').should('exist');
  });

  it('should logout successfully', () => {
    cy.get('input[type="email"]').type('admin@topsmile.com');
    cy.get('input[type="password"]').type('Admin123!');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/admin');
    cy.contains('Sair').click();
    
    cy.url().should('include', '/login');
    cy.getCookie('accessToken').should('not.exist');
  });

  it('should show session timeout warning', () => {
    cy.get('input[type="email"]').type('admin@topsmile.com');
    cy.get('input[type="password"]').type('Admin123!');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/admin');
    
    cy.clock();
    cy.tick(28 * 60 * 1000);
    
    cy.contains('Sessão Expirando').should('be.visible');
  });

  it('should auto-logout after timeout', () => {
    cy.get('input[type="email"]').type('admin@topsmile.com');
    cy.get('input[type="password"]').type('Admin123!');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/admin');
    
    cy.clock();
    cy.tick(30 * 60 * 1000);
    
    cy.url().should('include', '/login');
  });

  it('should refresh token automatically', () => {
    cy.intercept('POST', '/api/auth/refresh', { statusCode: 200 }).as('refresh');
    
    cy.get('input[type="email"]').type('admin@topsmile.com');
    cy.get('input[type="password"]').type('Admin123!');
    cy.get('button[type="submit"]').click();
    
    cy.intercept('GET', '/api/appointments', { statusCode: 401 }).as('unauthorized');
    cy.visit('/admin/appointments');
    
    cy.wait('@unauthorized');
    cy.wait('@refresh');
    
    cy.url().should('include', '/admin/appointments');
  });
});
