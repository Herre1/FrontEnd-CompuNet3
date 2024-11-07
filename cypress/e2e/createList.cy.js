// cypress/e2e/createList.spec.js

describe('Create List Functionality', () => {
    beforeEach(() => {
      // Simula el inicio de sesión para autenticación
      cy.visit('/login');
  
      // Ingresa las credenciales de inicio de sesión y envía el formulario
      cy.get('#email').type('roororosp3@hotmail.com');
      cy.get('#password').type('Victor9043');
      cy.get('button[type="submit"]').click();
  
      // Asegura que el usuario esté redirigido correctamente después del inicio de sesión
      cy.url().should('include', '/home');
  
      // Verifica que el token y userId se guarden en localStorage
      cy.window().then((window) => {
        expect(window.localStorage.getItem('token')).to.exist;
        expect(window.localStorage.getItem('userId')).to.exist;
      });
  
      // Navega a la página de creación de listas
      cy.visit('/list/create');
    });
  
    it('should display the create list form with content options', () => {
      // Asegura que el título de la página esté visible
      cy.contains('Crear Nueva Lista').should('be.visible');
  
      // Verifica que haya opciones de contenido disponibles
      cy.get('input[type="checkbox"]').should('have.length.greaterThan', 0);
    });
  
  
    it('should create a new list successfully', () => {
      // Selecciona al menos un contenido en el formulario
      cy.get('input[type="checkbox"]').first().check();
  
      // Completa el campo de estado
      cy.get('input#status').type('completed');
  
      // Envía el formulario
      cy.get('button[type="submit"]').click();
  
      // Verifica que redirige a la página de listas después de crear la lista
      cy.url().should('include', '/list');
    });
  
    it('should display error if user is not authenticated', () => {
      // Elimina el token para simular un estado no autenticado
      cy.window().then((window) => {
        window.localStorage.removeItem('token');
      });
  
      // Intenta enviar el formulario
      cy.get('input[type="checkbox"]').first().check();
      cy.get('input#status').type('completed');
      cy.get('button[type="submit"]').click();
  
      // Verifica que aparezca un mensaje de error de autenticación
      cy.contains('Authorization token not found').should('be.visible');
    });
  });
  