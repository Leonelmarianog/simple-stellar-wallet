# Simple Stellar Wallet

Very basic React implementation of a Non-Custodial "Wallet" based on Stellar Docs "Building an App" section ([LINK](https://developers.stellar.org/docs/building-apps/)).

# Actions

1. Create Account # Creates a test Stellar Account with a balance of 10000 XLM.

2. Make Payment # Make a payment to another account.

3. Copy Address # Copy account's public key to the browser's clipboard.

4. Copy Secret # Copy account's secret key to the browser's clipboard.

5. Sign out # Sign out of the application (deletes test account from browser's local storage).

# App Flow

1. To create a test account, users are required to enter a _pincode_. This pincode is used to encrypt the secret key of the account once it is created. Since this is just for learning purposes, this pincode can be any string of characters. The account is automatically funded on creation, making it accessable through the Stellar Ledger and allowing the user to make payments right away.

2. The secret key of the account is encrypted and stored in localStorage. This allows the app to automatically sign in again every time the user refreshes the page.

3. For certain actions, as a means of security, the user is asked to enter the pincode again via a modal. Only if the pincode matches the one used for encryption, the user will be able to perform the requested action.

# Tests

Tested with Cypress.

```
npm run test:ui:dev
```
