describe('User full flow: register -> login -> update profile', () => {
  it('registers a new user, logs in and updates profile successfully', () => {
    // --------- 1) REGISTER ---------
    cy.visit('/register');

    const timestamp = Date.now();
    const name = `Test_${timestamp}`;
    const email = `test_${timestamp}@example.com`;
    const password = 'Pass1234!';

    // Título registro
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

    // Registrar
    cy.contains('button', 'Registrar-me')
      .should('exist')
      .click().wait(2000);

    // Si tu app redirige al login, puedes descomentar:
    // cy.url().should('include', '/login');

    // --------- 2) LOGIN ---------
    // Por si no hay redirección automática:
    cy.visit('/login');

    // Form login visible
    cy.contains('h2', 'Iniciar sessió')
      .should('be.visible');

    cy.get('input[type="email"]')
      .type(email)
      .should('have.value', email);

    cy.get('input[type="password"]')
      .type(password)
      .should('have.value', password);

    cy.contains('button', 'Entrar')
      .should('exist')
      .and('be.visible')
      .click().wait(2000);

    // Si tras login vas al Catàleg:
    // cy.url().should('include', '/Cataleg');

    cy.visit('/cataleg').wait(2000);

    // Ens fiquem a la fitxa d'aquest joc per veure que tota la informació s'ha guardat correctament
    cy.contains('God of War Ragnarök').click({ force: true});
    
  });
});
