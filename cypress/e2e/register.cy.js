describe('Register', () => {
    it('should register a new user successfully', () => {
      // Visit the register page
      cy.visit('/register');
  
      // Fill in the registration form
      cy.get('#fullName').type('John Doe');
      cy.get('#email').type('johndoe@example.com');
      cy.get('#password').type('Password123!');
  
      // Submit the form
      cy.get('button[type="button"]').click();
  
      // Verify that the user is redirected to the login page
      cy.url().should('include', '/login');
  
      // Verify that a success message is displayed
      cy.get('.bg-green-50').should('contain', 'Registration successful');
    });
  
    it('should display an error message for missing fields', () => {
      // Visit the register page
      cy.visit('/register');
  
      // Submit the form without filling in any fields
      cy.get('button[type="button"]').click();
  
      // Verify that an error message is displayed
      cy.get('.bg-red-50').should('contain', 'Please complete all fields');
    });
  
    it('should display an error message for invalid email', () => {
      // Visit the register page
      cy.visit('/register');
  
      // Fill in the registration form with an invalid email
      cy.get('#fullName').type('John Doe');
      cy.get('#email').type('invalidemail');
      cy.get('#password').type('Password123!');
  
      // Submit the form
      cy.get('button[type="button"]').click();
  
      // Verify that an error message is displayed
      cy.get('.bg-red-50').should('contain', 'Registration failed, please try again.');
    });
  
    it('should display an error message for weak password', () => {
      // Visit the register page
      cy.visit('/register');
  
      // Fill in the registration form with a weak password
      cy.get('#fullName').type('John Doe');
      cy.get('#email').type('johndoe@example.com');
      cy.get('#password').type('password');
  
      // Submit the form
      cy.get('button[type="button"]').click();
  
      // Verify that an error message is displayed
      cy.get('.bg-red-50').should('contain', 'Registration failed, please try again.');
    });
  });