describe('Dashboard E2E Tests', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/login');
    cy.get('input[type="text"]').type('admin');
    cy.get('input[type="password"]').type('Admin123!');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should display dashboard content', () => {
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Welcome').should('be.visible');
  });

  it('should navigate to users page', () => {
    cy.contains('Users').click();
    cy.url().should('include', '/users');
    cy.contains('User Management').should('be.visible');
  });

  it('should toggle theme', () => {
    cy.get('button').contains('Dark').click();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    
    cy.get('button').contains('Light').click();
    cy.get('html').should('have.attr', 'data-theme', 'light');
  });
});

