/// <reference types="cypress" />

describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should show validation errors for empty form submission', () => {
    cy.get('button[type="submit"]').click();
    
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="password-error"]').should('be.visible');
  });

  it('should show validation error for invalid email', () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click();
    
    cy.get('[data-testid="email-error"]').should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'mock-token',
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
        },
      },
    }).as('loginRequest');

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.url().should('include', '/dashboard');
  });

  it('should show error message for invalid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        message: 'Invalid credentials',
      },
    }).as('loginRequest');

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.get('[data-testid="login-error"]').should('be.visible');
  });
}); 