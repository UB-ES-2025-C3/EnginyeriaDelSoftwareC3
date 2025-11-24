describe('Catàleg smoke', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/games*', {
      statusCode: 200,
      body: {
        items: [
          { _id: '1', name: 'Halo Infinite', genre: 'Shooter', year: 2021, platform: 'PC', image: 'https://example.com/halo.jpg', averageRating: 4.4, reviewCount: 40 },
          { _id: '2', name: 'Zelda TOTK', genre: 'Adventure', year: 2023, platform: 'Switch', image: 'https://example.com/zelda.jpg', averageRating: 4.9, reviewCount: 120 },
        ],
        page: 1,
        pageSize: 20,
        totalItems: 2,
        totalPages: 1,
        availableGenres: ['Shooter', 'Adventure'],
        availablePlatforms: ['PC', 'Switch'],
      },
    }).as('fetchGames');

    cy.visit('/cataleg');
    cy.wait('@fetchGames');
  });

  it('renderitza targetes i obre/tanca el panell de filtres', () => {
    cy.get('a[href^="/game/"]').should('have.length.at.least', 1);

    cy.get('button[aria-label="Obrir filtres"]').click();
    cy.contains('p', 'Refina la teva cerca per gèneres, plataformes i ordenació').should('be.visible');

    cy.get('button[aria-label="Tancar filtres"]').click();
    cy.get('.max-w-md.bg-gray-900').should('not.exist');
  });
});
