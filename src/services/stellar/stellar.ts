import {
  Server,
  ServerApi,
  Account,
  TransactionBuilder,
  BASE_FEE,
  Networks,
  Operation,
  Asset,
  Keypair,
} from 'stellar-sdk';

const server = new Server('https://horizon-testnet.stellar.org');

const fundAccount: (
  publicKey: string
) => Promise<ServerApi.AccountRecord> = async (publicKey) => {
  const response = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
  );
  const account: ServerApi.AccountRecord = await response.json();
  return account;
};

export const createAccount = async () => {
  const keypair = Keypair.random();
  const publicKey = keypair.publicKey();
  const secretKey = keypair.secret();
  const state = await fundAccount(publicKey);
  return { publicKey, secretKey, state };
};

export const getAccountState = async (publicKey: string) => {
  const state: ServerApi.AccountRecord = await server
    .accounts()
    .accountId(publicKey)
    .call();
  return state;
};

export const makePayment = async (
  amount: string,
  destination: string,
  secretKey: string
) => {
  const keypair = Keypair.fromSecret(secretKey);
  const publicKey = keypair.publicKey();
  const { sequence }: ServerApi.AccountRecord = await server
    .accounts()
    .accountId(publicKey)
    .call();
  const account = new Account(publicKey, sequence);
  const operation = Operation.payment({
    destination,
    amount,
    asset: Asset.native(),
  });
  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(operation)
    .setTimeout(0)
    .build();

  transaction.sign(keypair);

  const response = await server.submitTransaction(transaction);
  return response;
};
