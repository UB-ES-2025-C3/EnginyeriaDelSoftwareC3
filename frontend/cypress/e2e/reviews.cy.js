describe('User flow: register -> login -> footer -> Ressenyes', () => {
  it('registers, logs in and navigates to the all reviews page from the footer', () => {
    // ---------- 1) REGISTER ----------
    cy.visit('/register');

    const timestamp = Date.now();
    const name = `Test_${timestamp}`;
    const email = `test_${timestamp}@example.com`;
    const password = 'Pass1234!';

    // Título registro
    cy.contains('h2', 'Crear compte').should('be.visible');

    // Nombre
    cy.get('input[placeholder="El teu nom"]')
      .type(name)
      .should('have.value', name);

    // Email
    cy.get('input[placeholder="tucorreo@mail.com"]')
      .type(email)
      .should('have.value', email);

    // Password
    cy.get('input[placeholder="Mínim 8 caràcters (Aa0...)"]')
      .type(password)
      .should('have.value', password);

    cy.contains('button', 'Registrar-me')
      .should('exist')
      .click()
      .wait(2000);

    // ---------- 2) LOGIN ----------
    cy.visit('/login');

    cy.contains('h2', 'Iniciar sessió').should('be.visible');

    cy.get('input[type="email"]')
      .type(email)
      .should('have.value', email);

    cy.get('input[type="password"]')
      .type(password)
      .should('have.value', password);

    cy.contains('button', 'Entrar')
      .should('exist')
      .click()
      .wait(2000);

    // ---------- 3) IR A UNA PÁGINA CON FOOTER (CATÀLEG) ----------
    cy.visit('/cataleg').wait(1000);

    // ---------- 4) CLICK EN "Ressenyes" DEL FOOTER ----------
    // Nos aseguramos de buscar el link dentro del footer
    cy.get('footer')
      .should('be.visible')
      .within(() => {
        cy.contains('Ressenyes')
          .should('exist')
          .click();
      });

    // ---------- 5) COMPROBAR QUE ESTAMOS EN LA PÁGINA DE TOTES LES RESSENYES ----------
    cy.url().should('include', '/reviews');

    // Si tu pàgina de totes les ressenyes té algun títol, puedes añadir algo tipo:
    // cy.contains('h1', 'Ressenyes').should('be.visible');
  });
});
