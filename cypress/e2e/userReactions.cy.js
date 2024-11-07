// cypress/e2e/userReactions.spec.js

describe('User Reactions', () => {
    beforeEach(() => {
      // Visitar la página de inicio de sesión
      cy.visit('/login');
  
      // Ingresar las credenciales de usuario válidas
      cy.get('#email').type('panterrosa9043@hotmail.com');
      cy.get('#password').type('Victor9043');
  
      // Enviar el formulario de inicio de sesión
      cy.get('button[type="submit"]').click();
  
      // Verificar que el usuario ha iniciado sesión correctamente
      cy.url().should('include', '/home');
      cy.window().then((window) => {
        expect(window.localStorage.getItem('token')).to.exist;
        expect(window.localStorage.getItem('userId')).to.exist;
      });
    });
  
    it('should display user reactions if available', () => {
      // Navegar a la página de reacciones del usuario
      cy.visit('/reaction');
  
      // Verificar que el título de la página de reacciones se muestra
      cy.contains('Tus Reacciones').should('be.visible');
  
      // Verificar si las reacciones están presentes
      cy.get('body').then(($body) => {
        if ($body.find('.bg-blue-50').length > 0) {
          // Si hay reacciones, verificar que se muestren correctamente
          cy.get('.bg-blue-50').should('exist');
          cy.get('.bg-blue-50').first().within(() => {
            cy.contains('Comentario:').should('exist');
            cy.contains('Reacciones:').should('exist');
            cy.contains('Creado por:').should('exist');
          });
        } else {
          // Si no hay reacciones, verificar que el mensaje de "No tienes reacciones disponibles" se muestre
          cy.contains('No tienes reacciones disponibles.').should('be.visible');
        }
      });
    });
  
    it('should handle errors if token is missing', () => {
      // Remover el token de autenticación
      cy.window().then((window) => {
        window.localStorage.removeItem('token');
      });
  
      // Intentar visitar la página de reacciones del usuario sin token
      cy.visit('/reaction');
  
      // Verificar que redirige a la página de inicio de sesión
      cy.url().should('include', '/login');
    });
  });
  