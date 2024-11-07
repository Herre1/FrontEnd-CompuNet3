// cypress/e2e/login.spec.js
describe('Login', () => {
    it('should login successfully', () => {
      // Visit the login page
      cy.visit('/login');
  
      // Fill in the login form
      cy.get('#email').type('roororosp3@hotmail.com');
      cy.get('#password').type('Victor9043');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Verify that the user is redirected to the home page
      cy.url().should('include', '/home');
  
      // Verify that the user's token and user ID are stored in localStorage
      cy.window().then((window) => {
        expect(window.localStorage.getItem('token')).to.exist;
        expect(window.localStorage.getItem('userId')).to.exist;
        expect(window.localStorage.getItem('username')).to.exist;
      });
    });
  
    it('should display an error message for invalid credentials', () => {
      // Visit the login page
      cy.visit('/login');
  
      // Fill in the login form with invalid credentials
      cy.get('#email').type('wronguser@example.com');
      cy.get('#password').type('wrongpassword');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Verify that an error message is displayed
      cy.get('.bg-red-50').should('contain', 'Invalid credentials (email)');
    });
  });