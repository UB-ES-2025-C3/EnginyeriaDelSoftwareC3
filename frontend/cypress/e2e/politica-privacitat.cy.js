describe('User flow: register -> login -> footer -> Política de privacitat', () => {
  it('registers, logs in and navigates to the privacy policy page from the footer', () => {
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

    cy.visit('/login');

    cy.contains('h2', 'Iniciar sessió').should('be.visible');

    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);

    cy.contains('button', 'Entrar').click().wait(2000);

    cy.visit('/cataleg').wait(1000);

    cy.get('footer')
      .should('be.visible')
      .within(() => {
        cy.contains("Política de privacitat")
          .should('exist')
          .click();
      });

    cy.url().should('include', '/privacitat');
  });
});