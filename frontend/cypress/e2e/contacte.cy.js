describe('User flow: register -> login -> footer -> Contacte -> send message', () => {
  it('registers, logs in, navigates to Contacte and sends a contact message', () => {
    // ---------- 1) REGISTER ----------
    cy.visit('/register');

    const timestamp = Date.now();
    const name = `Test_${timestamp}`;
    const email = `test_${timestamp}@example.com`;
    const password = 'Pass1234!';

    cy.contains('h2', 'Crear compte').should('be.visible');

    cy.get('input[placeholder="El teu nom"]').type(name);
    cy.get('input[placeholder="tucorreo@mail.com"]').type(email);
    cy.get('input[placeholder="Mínim 8 caràcters (Aa0...)"]').type(password);

    cy.contains('button', 'Registrar-me')
      .should('exist')
      .click()
      .wait(2000);

    // ---------- 2) LOGIN ----------
    cy.visit('/login');

    cy.contains('h2', 'Iniciar sessió').should('be.visible');

    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);

    cy.contains('button', 'Entrar')
      .should('exist')
      .click()
      .wait(2000);

    // ---------- 3) IR A CATÀLEG (FOOTER) ----------
    cy.visit('/cataleg').wait(1000);

    // ---------- 4) FOOTER -> CONTACTE ----------
    cy.get('footer')
      .should('be.visible')
      .within(() => {
        cy.contains('Contacte')
          .should('exist')
          .click();
      });

    cy.url().should('include', '/contacte');

    // ---------- 5) RELLENAR Y ENVIAR FORMULARIO DE CONTACTO ----------
    const subject = `Prova contacte ${timestamp}`;
    const message = 'Aquest és un missatge de prova des de Cypress.';

    // Nombre (por si no viene pre-rellenado)
    cy.get('#nombre')
      .clear()
      .type(name)
      .should('have.value', name);

    // Email (por si no viene pre-rellenado)
    cy.get('#email')
      .clear()
      .type(email)
      .should('have.value', email);

    // Tipo de mensaje
    cy.get('#tipo')
      .select('💡 Suggeriment de millora'); // valor visible, el value real es "mejora"

    // Asunto
    cy.get('#asunto')
      .type(subject)
      .should('have.value', subject);

    // Mensaje
    cy.get('#mensaje')
      .type(message)
      .should('have.value', message);

    // Enviar formulario
    cy.contains('button', 'Enviar missatge')
      .should('exist')
      .and('not.be.disabled')
      .click();

  });
});