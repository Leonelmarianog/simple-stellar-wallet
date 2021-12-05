describe('wallet', () => {
  it('should allow users to copy their public key', () => {
    const pincode = '123456';

    cy.createStellarAccount(pincode, pincode);
    cy.getByDataTestAttribute('copy-address').click();
    cy.getByDataTestAttribute('notificator-copy-address-feedback').should(
      'have.text',
      'Copied to clipboard.'
    );
  });

  it('should allow users to copy their secret key after successful pincode input', () => {
    const pincode = '123456';

    cy.createStellarAccount(pincode, pincode);
    cy.getByDataTestAttribute('copy-secret').click();
    cy.getByDataTestAttribute('require-pincode-pincode').type(pincode);
    cy.getByDataTestAttribute('require-pincode-submit').click();
    cy.getByDataTestAttribute('notificator-copy-secret-feedback').should(
      'have.text',
      'Copied to clipboard.'
    );
  });

  it('should deny users to copy their secret key after invalid pincode input', () => {
    const pincode = '123456';
    const pincodeConfirm = '456123';

    cy.createStellarAccount(pincode, pincode);
    cy.getByDataTestAttribute('copy-secret').click();

    cy.getByDataTestAttribute('require-pincode-pincode').type(pincodeConfirm);
    cy.getByDataTestAttribute('require-pincode-submit').click();
    cy.getByDataTestAttribute('notificator-copy-secret-feedback').should(
      'have.text',
      'Invalid pincode.'
    );
  });
});
