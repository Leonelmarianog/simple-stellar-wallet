/// <reference types="cypress" />

// Reference: https://docs.cypress.io/guides/tooling/typescript-support#Types-for-custom-commands
// Example: https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/global.d.ts
declare namespace Cypress {
  interface Chainable {
    getByDataTestAttribute(
      dataTestAttribute: string,
      args?: any
    ): Chainable<JQuery<HTMLElement>>;
  }
}
