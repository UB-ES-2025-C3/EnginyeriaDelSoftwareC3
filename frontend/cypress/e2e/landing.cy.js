describe('Landing Page', () => {

  beforeEach(() => {
    // Ajusta si la URL real es distinta
    cy.visit('/');
  });

  it('renders landing page correctly', () => {

    // Título principal dividido en dos partes
    cy.get('h1')
      .should('contain.text', 'El teu món')
      .and('contain.text', 'gamer comença!');

    // Botón de login/registro
    cy.contains('button', 'Iniciar sessió/Registrar-se')
      .should('exist')
      .and('be.visible');

    // Botón de invitado
    cy.contains('button', 'Accedeix com a convidat')
      .should('exist')
      .and('be.visible');

    // Imagen de Mario pixelado
    cy.get('img[alt="Pixel Mario"]')
      .should('exist')
      .and('be.visible');

  });

});
