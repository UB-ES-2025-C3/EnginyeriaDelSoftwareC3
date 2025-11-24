describe('Login page', () => {

  beforeEach(() => {
    // Ajusta la ruta si tu página de login está en otra URL
    cy.visit('/login');
  });

  it('renders the login form correctly', () => {
    // Título
    cy.contains('h2', 'Iniciar sessió')
      .should('be.visible');

    // Input email
    cy.get('input[type="email"]')
      .should('exist')
      .and('be.visible');

    // Input password
    cy.get('input[type="password"]')
      .should('exist')
      .and('be.visible');

    // Botón Entrar
    cy.contains('button', 'Entrar')
      .should('exist')
      .and('be.visible');
  });

  it('fills and submits the login form with a test user', () => {
    // Usuario de prueba con timestamp (por si en algún momento lo usas también para registro)
    const timestamp = Date.now();
    const email = `test@example.com`;
    const password = 'Pass1234!';

    // Rellenar email
    cy.get('input[type="email"]')
      .type(email)
      .should('have.value', email);

    // Rellenar contraseña
    cy.get('input[type="password"]')
      .type(password)
      .should('have.value', password);

    // Click en Entrar
    cy.contains('button', 'Entrar')
      .should('exist')
      .click();

    // Si muestra un mensaje:
    // cy.contains('Sessió iniciada correctament').should('be.visible');
  });

});
