describe('Authentication E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('input[type="text"]').type('admin');
    cy.get('input[type="password"]').type('Admin123!');
    cy.get('button[type="submit"]').click();

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[type="text"]').type('admin');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains(/invalid credentials/i).should('be.visible');
  });

  it('should logout successfully', () => {
    // Login first
    cy.get('input[type="text"]').type('admin');
    cy.get('input[type="password"]').type('Admin123!');
    cy.get('button[type="submit"]').click();

    // Wait for dashboard
    cy.url().should('include', '/dashboard');

    // Logout
    cy.contains('Logout').click();

    // Should redirect to login
    cy.url().should('include', '/login');
  });
});

