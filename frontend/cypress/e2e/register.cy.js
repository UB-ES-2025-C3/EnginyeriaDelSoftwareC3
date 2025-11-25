describe('Register page', () => {

  beforeEach(() => {
    cy.visit('/register');
  });

  it('fills and submits the registration form with unique timestamped user', () => {

    // Generamos un timestamp para evitar duplicados
    const timestamp = Date.now();
    const name = `Test_${timestamp}`;
    const email = `test_${timestamp}@example.com`;
    const password = `Pass1234!`;

    // Título
    cy.contains('h2', 'Crear compte')
      .should('be.visible');

    // Nombre
    cy.get('input[placeholder="El teu nom"]')
      .type(name)
      .should('have.value', name);

    // Email único
    cy.get('input[placeholder="tucorreo@mail.com"]')
      .type(email)
      .should('have.value', email);

    // Password
    cy.get('input[placeholder="Mínim 8 caràcters (Aa0...)"]')
      .type(password)
      .should('have.value', password);

    // Botón Registrar
    cy.contains('button', 'Registrar-me')
      .should('exist')
      .click();

    // Puedes activar esto si tu app redirige al login
    // cy.url().should('include', '/login');

    // O si muestra mensaje
    // cy.contains('Compte creat correctament').should('be.visible');
  });
});
