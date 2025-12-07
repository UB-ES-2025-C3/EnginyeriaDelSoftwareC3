describe('User flow: register -> login -> footer -> FAQS', () => {
  it('registers, logs in, goes to FAQS and searches "Com puc reportar"', () => {
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

    cy.contains('button', 'Registrar-me').click().wait(2000);

    // ---------- 2) LOGIN ----------
    cy.visit('/login');

    cy.contains('h2', 'Iniciar sessió').should('be.visible');

    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);

    cy.contains('button', 'Entrar').click().wait(2000);

    // ---------- 3) IR A CATÀLEG (FOOTER) ----------
    cy.visit('/cataleg').wait(1000);

    // ---------- 4) FOOTER -> FAQS ----------
    cy.get('footer')
      .should('be.visible')
      .within(() => {
        cy.contains('FAQS')
          .should('exist')
          .click();
      });

    cy.url().should('include', '/faqs');

    // ---------- 5) BUSCAR "Com puc reportar" EN LES FAQs ----------
    cy.get('input[placeholder="Cerca en les FAQs..."]')
      .should('be.visible')
      .type('Com puc reportar');

    // Click en el resultat "Com puc reportar contingut inapropiat?"
    cy.contains('h3', 'Com puc reportar contingut inapropiat?')
      .should('be.visible')
      .click();
  });
});