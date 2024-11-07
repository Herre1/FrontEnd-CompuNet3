// cypress/e2e/userLists.spec.js

describe('User Lists Functionality', () => {
    beforeEach(() => {
      // Simula el inicio de sesión para que el usuario esté autenticado
      cy.visit('/login');
  
      // Inicia sesión con credenciales válidas
      cy.get('#email').type('panterrosa9043@hotmail.com');
      cy.get('#password').type('Victor9043');
      cy.get('button[type="submit"]').click();
  
      // Asegura que el usuario esté redirigido correctamente
      cy.url().should('include', '/home');
  
      // Verifica que el token de autenticación esté guardado en el localStorage
      cy.window().then((window) => {
        expect(window.localStorage.getItem('token')).to.exist;
        expect(window.localStorage.getItem('userId')).to.exist;
      });
    });
  
    it('should display user lists and contents correctly', () => {
      // Visita la página de listas del usuario
      cy.visit('/list');
  
      // Verifica que el título "Tus Listas" esté visible
      cy.contains('Tus Listas').should('be.visible');
  
      // Verifica si hay listas cargadas
      cy.get('body').then(($body) => {
        if ($body.find('.bg-white').length > 0) {
          // Si hay listas, verifica que muestran el estado y ID correctamente
          cy.get('.bg-white').first().within(() => {
            cy.contains('Estado:').should('exist');
            cy.contains('ID:').should('exist');
          });
  
          // Verifica que los contenidos de las listas muestran el título y descripción
          cy.get('ul.space-y-4').within(() => {
            cy.get('li').first().within(() => {
              cy.contains('Breaking Bad').should('exist');
              cy.contains('A high school chemistry teacher').should('exist');
            });
          });
        } else {
          // Si no hay listas, muestra el mensaje correspondiente
          cy.contains('No se encontraron listas que coincidan con tu búsqueda.').should('be.visible');
        }
      });
    });
  
    it('should filter lists based on search term', () => {
      // Navega a la página de listas del usuario
      cy.visit('/list');
  
      // Busca el campo de búsqueda y escribe "completed"
      cy.get('input[placeholder="Buscar listas o contenidos..."]').type('completed');
  
      // Verifica que solo aparezcan listas con estado "completed"
      cy.get('.bg-white').each(($list) => {
        cy.wrap($list).contains('Estado: completed').should('exist');
      });
    });
  
    it('should allow the user to delete a list', () => {
      // Navega a la página de listas del usuario
      cy.visit('/list');
  
      // Comprueba que hay al menos una lista antes de eliminar
      cy.get('body').then(($body) => {
        if ($body.find('.bg-white').length > 0) {
          // Elimina la primera lista
          cy.get('.bg-white').first().within(() => {
            cy.get('button').click();
          });
  
          // Verifica que la lista haya sido eliminada
          cy.contains('No se encontraron listas que coincidan con tu búsqueda.').should('not.exist');
        } else {
          // Si no hay listas, muestra un mensaje informativo
          cy.contains('No se encontraron listas que coincidan con tu búsqueda.').should('be.visible');
        }
      });
    });
  
    it('should redirect to login if no token is found', () => {
      // Elimina el token de autenticación para simular una sesión no autenticada
      cy.window().then((window) => {
        window.localStorage.removeItem('token');
      });
  
      // Intenta visitar la página de listas sin autenticación
      cy.visit('/list');
  
      // Verifica que redirige a la página de inicio de sesión
      cy.url().should('include', '/login');
    });
  });
  