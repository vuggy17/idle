describe('User Registration', () => {
  it('should register a new user when given unique username and password', () => {
    // Go to registration page
    cy.visit('/register');

    // Enter unique username and password
    cy.get('#username').type('uniqueUsername');
    cy.get('#password').type('securePassword');

    // Click register button
    cy.get('#registerButton').click();

    // Assert user is redirected to some page (e.g., home page) after successful registration
    cy.url().should('include', '/home');
  });
});
