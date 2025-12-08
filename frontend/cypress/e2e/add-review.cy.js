describe('User flow: register -> catàleg -> game -> write review', () => {
  it('registers, logs in, opens a game and publishes a review', () => {
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
      .wait(3000);

    // ---------- 2) LOGIN (si tu app no deja logueado tras el registro) ----------
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

    // ---------- 3) INTERCEPTAR CREACIÓ DE RESSENYA ----------
    cy.intercept('POST', '**/games/*/reviews', (req) => {
      const body = req.body;

      req.reply({
        statusCode: 201,
        body: {
          // Muy importante: GameCard.vue espera res.review
          review: {
            _id: 'mock-review-id',
            stars: body.stars,
            text: body.text,
            user: {
              name,
              avatarUrl: null,
            },
            createdAt: new Date().toISOString(),
          },
        },
      });
    }).as('createReview');

    // ---------- 4) IR AL CATÀLEG Y ABRIR UN JUEGO ----------
    cy.visit('/cataleg').wait(2000);

    // Ajusta el nombre si tu catálogo muestra otro juego
    cy.contains('God of War Ragnarök')
      .should('exist')
      .click({ force: true });

    // ---------- 5) ABRIR FORMULARIO DE RESSENYA ----------
    cy.contains('button', 'Escriure una ressenya')
      .should('exist')
      .click();

    const reviewText = `Resenya de prova ${timestamp}`;

    // Select de puntuació (único <select> del formulario)
    // El texto de la opción es "5 estrelles"
    cy.get('select')
      .first()
      .select('3 estrellas');

    // Textarea del comentari (no tiene name/id, usamos el placeholder)
    cy.get('textarea[placeholder="Explica què t\'ha semblat el joc..."]')
      .type(reviewText)
      .should('have.value', reviewText);

    // Enviar
    cy.contains('button', 'Publicar ressenya')
      .should('exist')
      .click();
  });
});
