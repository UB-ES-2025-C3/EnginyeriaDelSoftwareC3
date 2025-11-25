describe('Perfil page', () => {
  const TEST_EMAIL = 'test@example.com';
  const TEST_PASSWORD = 'Pass1234!';

  beforeEach(() => {
    // Iniciar sesión
    cy.visit('/login');

    cy.get('input[type="email"]').type(TEST_EMAIL);
    cy.get('input[type="password"]').type(TEST_PASSWORD);
    cy.contains('button', 'Entrar').click().wait(2000);

    // Stub del GET de perfil
    cy.intercept('GET', '**/profile', {
      statusCode: 200,
      body: {
        name: 'test',
        email: 'test@example.com',
        bio: 'This is a test bio.',
        links: {
          steam: 'steam.com/test',
          twitch: 'twitch.tv/test',
        },
        avatarUrl: null,
        bannerUrl: null,
      },
    }).as('getProfile');

    // Stub del UPDATE del perfil
    cy.intercept('PUT', '**/profile', {
      statusCode: 200,
      body: { success: true }
    }).as('updateProfile');

  });

  it('fills the profile fields and submits successfully', () => {

    // Nuevos valores
    const timestamp = Date.now();
    const newBio = 'Updated bio text' + timestamp;
    const newSteam = 'https://steam.com/updated' + timestamp;
    const newTwitch = 'https://twitch.tv/updated' + timestamp;
    const newPSN = 'PSN-User-Updated' + timestamp;
    const newXbox = 'Xbox-User-Updated' + timestamp;

    // Ir al perfil
    cy.visit('/perfil').wait(1000);

    // Bio editable
    cy.get('#bio')
      .should('be.visible')
      .clear()
      .type(newBio)
      .should('have.value', newBio);

    // Steam
    cy.get('#steam')
      .clear()
      .type(newSteam)
      .should('have.value', newSteam);

    // Twitch
    cy.get('#twitch')
      .clear()
      .type(newTwitch)
      .should('have.value', newTwitch);

    // PSN
    cy.get('#psn')
      .clear()
      .type(newPSN)
      .should('have.value', newPSN);

    // Xbox
    cy.get('#xbox')
      .clear()
      .type(newXbox)
      .should('have.value', newXbox);

    // Botón guardar debe activarse
    cy.contains('button', 'Desar canvis')
      .should('not.be.disabled')
      .click();

    // mensaje de éxito (si existe en tu UI)
    cy.contains('Canvis desats correctament').should('be.visible');
  });
});
