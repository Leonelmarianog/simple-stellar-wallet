describe('Home Page', () => {
  it('should display a welcome message', () => {
    cy.visit('/');

    cy.getByDataTestAttribute('welcome-message').should(
      'have.text',
      'Hello World'
    );
  });
});
