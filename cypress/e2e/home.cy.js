describe('Home Page', () => {
    it('should display the expected content', () => {
      cy.visit('/');
      cy.get('h1').should('contain', 'Hello, world!');
    });
  });