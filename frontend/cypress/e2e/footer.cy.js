it('Comprovem que el footer funciona correctament', () => {
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

    // --------- 3) Termes d'ús ---------
    cy.contains("Termes d'ús").click();
    
    // --------- 3) Política de privacitat ---------
    cy.contains("Política de privacitat").click().wait(1000);

    // --------- 4) Política de privacitat ---------
    cy.contains("a","Contacte").click();

    const assumpte = 'Assumpte de prova';
    const missatge = 'Aquest és un missatge de prova per al formulari de contacte.';

    cy.get('#asunto').type(assumpte).should('have.value', assumpte);

    cy.get('#mensaje').type(missatge).should('have.value', missatge);

    cy.get('button[type="submit"]').click().wait(1000);

    // --------- 5) FAQS ---------
    cy.contains("a","Contacte").click();

    cy.get('button[type="submit"]').click().wait(1000);

    cy.get('#nombre').type(name).should('have.value', name);

    cy.get('#email').type(email).should('have.value', email);

    cy.get('#asunto').type(assumpte).should('have.value', assumpte);

    cy.get('#mensaje').type(missatge).should('have.value', missatge);

    cy.get('button[type="submit"]').click().wait(1000);

});
    