Cypress.Commands.add('login', (email, password) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:4000/api/auth/login',
        body: { email, password }
    }).then((resp) => {
        window.localStorage.setItem('token', resp.body.token);
        window.localStorage.setItem('user', JSON.stringify(resp.body.user));
    });
});
