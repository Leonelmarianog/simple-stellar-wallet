describe('wallet', () => {
  it('should allow users to copy their public key', () => {
    const pincode = '123456';

    cy.createStellarAccount(pincode, pincode);
    cy.getByDataTestAttribute('copy-address-button').click();
    cy.getByDataTestAttribute('notificator-copy-address-success').should(
      'have.text',
      'Copied to clipboard'
    );
  });

  it('should allow users to copy their secret key after successful pincode input', () => {
    const pincode = '123456';

    cy.createStellarAccount(pincode, pincode);
    cy.getByDataTestAttribute('copy-secret-button').click();
    cy.getByDataTestAttribute('require-pincode-form-pincode').type(pincode);
    cy.getByDataTestAttribute('require-pincode-form-submit').click();
    cy.getByDataTestAttribute('notificator-copy-secret-success').should(
      'have.text',
      'Copied to clipboard'
    );
  });

  it('should deny users to copy their secret key after invalid pincode input', () => {
    const pincode = '123456';
    const pincodeConfirm = '456123';

    cy.createStellarAccount(pincode, pincode);
    cy.getByDataTestAttribute('copy-secret-button').click();
    cy.getByDataTestAttribute('require-pincode-form-pincode').type(
      pincodeConfirm
    );
    cy.getByDataTestAttribute('require-pincode-form-submit').click();
    cy.get('#pincode-helper-text').should('have.text', 'Invalid pincode');
    cy.getByDataTestAttribute('require-pincode-form-submit').should(
      'be.disabled'
    );
  });
});
