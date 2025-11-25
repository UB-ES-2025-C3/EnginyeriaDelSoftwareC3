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

    // --------- 3) PERFIL (GET + PUT interceptados) ---------
    cy.intercept('GET', '**/profile', {
      statusCode: 200,
      body: {
        name,
        email,
        bio: 'This is a test bio.',
        links: {
          steam: 'https://steam.com/test',
          twitch: 'https://twitch.tv/test',
        },
        avatarUrl: null,
        bannerUrl: null,
      },
    }).as('getProfile');

    cy.intercept('PUT', '**/profile', {
      statusCode: 200,
      body: { success: true },
    }).as('updateProfile');

    cy.visit('/perfil');

    // --------- 4) RELLENAR CAMPOS PERFIL ---------
    const newBio    = 'Updated bio text';
    const newSteam  = 'https://steam.com/updated';
    const newTwitch = 'https://twitch.tv/updated';
    const newPSN    = 'PSN-User-Updated';
    const newXbox   = 'Xbox-User-Updated';

    cy.contains('h2', 'El Meu Perfil').should('be.visible').wait(1000);

    cy.get('#bio')
      .should('be.visible')
      .clear()
      .type(newBio)
      .should('have.value', newBio);

    cy.get('#steam')
      .clear()
      .type(newSteam)
      .should('have.value', newSteam);

    cy.get('#twitch')
      .clear()
      .type(newTwitch)
      .should('have.value', newTwitch);

    cy.get('#psn')
      .clear()
      .type(newPSN)
      .should('have.value', newPSN);

    cy.get('#xbox')
      .clear()
      .type(newXbox)
      .should('have.value', newXbox);

    cy.contains('button', 'Desar canvis')
      .should('not.be.disabled')
      .click();

    // Mensaje de éxito (ajusta el texto si es distinto)
    cy.contains('Perfil desat correctament').should('be.visible');

    cy.visit('/cataleg').wait(2000);

    // Ens fiquem a la fitxa d'aquest joc per veure que tota la informació s'ha guardat correctament
    cy.contains('God of War Ragnarök').click({ force: true});
    
    
  });
});
