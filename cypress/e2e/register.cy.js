describe('Register', () => {
  it('should register a new user successfully', () => {
    cy.visit('/register')
    // Visit the register page
    cy.url({ timeout: 10000 }).should('include', '/register');
    
    // Fill in the registration form
    cy.get('input[name="username"]').type('John Doe');
    cy.get('input[name="email"]').type('johndoe@example.com');
    cy.get('input[name="password"]').type('Password123!');

    // Submit the form
    cy.get('button[type="button"]').click();
    
    // Wait for the URL change after successful registration (with timeout)
    cy.url({ timeout: 10000 }).should('include', '/login');
    
  });

  it('should display an error message for missing fields', () => {
    cy.visit('/register')
    // Visit the register page
    cy.url({ timeout: 10000 }).should('include', '/register');
    
    // Submit the form without filling in any fields
    cy.get('button[type="button"]').click();
    
    // Verify that an error message is displayed
    cy.get('.bg-red-50').should('contain', 'Please complete all fields');
  });

  it('should display an error message for invalid email', () => {
    cy.visit('/register')
    // Visit the register page
    cy.url({ timeout: 10000 }).should('include', '/register');
    
    // Fill in the registration form with an invalid email
    cy.get('input[name="username"]').type('John Doe');
    cy.get('input[name="email"]').type('invalidemail');
    cy.get('input[name="password"]').type('Password123!');
    
    // Submit the form
    cy.get('button[type="button"]').click();
    
    // Verify that an error message is displayed
    cy.get('.bg-red-50').should('contain', 'Registration failed, please try again.');
  });

  it('should display an error message for weak password', () => {
    cy.visit('/register')
    // Visit the register page
    cy.url({ timeout: 10000 }).should('include', '/register');
    
    // Fill in the registration form with a weak password
    cy.get('input[name="username"]').type('John Doe');
    cy.get('input[name="email"]').type('johndoe@example.com');
    cy.get('input[name="password"]').type('password');
    
    // Submit the form
    cy.get('button[type="button"]').click();
    
    // Verify that an error message is displayed
    cy.get('.bg-red-50').should('contain', 'Registration failed, please try again.');
  });
});
