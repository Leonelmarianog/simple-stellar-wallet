describe('Account creation, sign in and sign out', () => {
  it('should redirect unauthenticated users to the account creation page', () => {
    cy.visit('/');
    cy.getByDataTestAttribute('create-account-button').should('be.visible');
  });

  it('should redirect users to the wallet page after sign up', () => {
    const pincode = '123456';

    cy.createStellarAccount(pincode, pincode);
    cy.getByDataTestAttribute('wallet').should('be.visible');
  });

  it('should redirect authenticated users to the wallet page after page reload', () => {
    const pincode = '123456';

    cy.createStellarAccount(pincode, pincode);
    cy.getByDataTestAttribute('wallet').should('be.visible');
    cy.reload();
    cy.getByDataTestAttribute('wallet').should('be.visible');
  });

  it('should redirect users to the account creation page after sign out', () => {
    const pincode = '123456';

    cy.createStellarAccount(pincode, pincode);
    cy.getByDataTestAttribute('wallet').should('be.visible');
    cy.signOut();
    cy.getByDataTestAttribute('wallet').should('not.exist');
    cy.getByDataTestAttribute('create-account-button').should('be.visible');
  });

  it('should validate "CreateAccountForm"', () => {
    cy.visit('/');
    cy.getByDataTestAttribute('create-account-button').click();

    cy.getByDataTestAttribute('create-account-form-pincode')
      .find('input')
      .focus()
      .blur();
    cy.get('#pincode-helper-text').should('have.text', 'Pincode required');
    cy.getByDataTestAttribute('create-account-form-submit').should(
      'be.disabled'
    );

    cy.getByDataTestAttribute('create-account-form-pincode').type('123456');
    cy.get('#pincode-helper-text').should('not.exist');
    cy.getByDataTestAttribute('create-account-form-submit').should(
      'be.disabled'
    );

    cy.getByDataTestAttribute('create-account-form-pincode-confirm')
      .find('input')
      .focus()
      .blur();
    cy.get('#pincodeConfirm-helper-text').should(
      'have.text',
      'Must confirm pincode'
    );
    cy.getByDataTestAttribute('create-account-form-submit').should(
      'be.disabled'
    );

    cy.getByDataTestAttribute('create-account-form-pincode-confirm').type(
      '1234567'
    );
    cy.get('#pincodeConfirm-helper-text').should(
      'have.text',
      'Pincode does not match'
    );
    cy.getByDataTestAttribute('create-account-form-submit').should(
      'be.disabled'
    );

    cy.getByDataTestAttribute('create-account-form-pincode-confirm')
      .clear()
      .type('123456');
    cy.get('#pincodeConfirm-helper-text').should('not.exist');
    cy.getByDataTestAttribute('create-account-form-submit').should(
      'be.enabled'
    );
  });

  it('should validate "RequirePincodeForm"', () => {
    const pincode = '123456';

    cy.createStellarAccount(pincode, pincode);

    cy.getByDataTestAttribute('copy-secret').click();

    cy.getByDataTestAttribute('require-pincode-form-pincode')
      .find('input')
      .focus()
      .blur();
    cy.get('#pincode-helper-text').should('have.text', 'Pincode required');
    cy.getByDataTestAttribute('require-pincode-form-submit').should(
      'be.disabled'
    );

    cy.getByDataTestAttribute('require-pincode-form-pincode').type(pincode);
    cy.get('#pincode-helper-text').should('not.exist');
    cy.getByDataTestAttribute('require-pincode-form-submit').should(
      'be.enabled'
    );
  });
});
