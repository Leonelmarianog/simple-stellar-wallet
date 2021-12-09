// @ts-check
///<reference path="../global.d.ts" />

Cypress.Commands.add('getByDataTestAttribute', (dataTestAttribute, ...args) => {
  return cy.get(`[data-cy=${dataTestAttribute}]`, ...args);
});

Cypress.Commands.add('createStellarAccount', (pincode, confirmPincode) => {
  cy.visit('/');
  cy.getByDataTestAttribute('create-account-button').click();
  cy.getByDataTestAttribute('create-account-form-pincode').type(pincode);
  cy.getByDataTestAttribute('create-account-form-pincode-confirm').type(
    confirmPincode
  );
  cy.getByDataTestAttribute('create-account-form-submit').click();
});

Cypress.Commands.add('signOut', () => {
  cy.visit('/');
  cy.getByDataTestAttribute('sign-out-button').click();
  cy.getByDataTestAttribute('sign-out-submit').click();
});
