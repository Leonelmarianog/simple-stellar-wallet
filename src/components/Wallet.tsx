import { FC, useEffect, useState } from 'react';
import { ServerApi } from 'stellar-sdk';
import sjcl from 'sjcl';
import JSONPretty from 'react-json-pretty';
import monikaiTheme from 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as storage from '../services/storage/storage';
import * as stellar from '../services/stellar/stellar';
import CreateAccountForm from './CreateAccountForm';
import RequirePincodeForm from './RequirePincodeForm';
import MakePaymentForm from './MakePaymentForm';
import Modal from '@mui/material/Modal';
import useDisclosure from '../hooks/useDisclosure';
import useNotificationContext from '../contexts/notification/useNotificationContext';
import FormValidationException from '../exceptions/FormValidationException';
import * as encryptionExceptions from '../utils/exceptions/encryption';
import * as stellarExceptions from '../utils/exceptions/stellar';

interface CreateAccountModalWithTriggerProps {
  createAccountCallback: (pincode: string) => Promise<void>;
}

const CreateAccountModalWithTrigger: FC<CreateAccountModalWithTriggerProps> = ({
  createAccountCallback,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button
        variant="contained"
        onClick={onOpen}
        data-cy="create-account-button"
      >
        Create Account
      </Button>

      <Modal open={isOpen} onClose={onClose}>
        <div>
          <CreateAccountForm
            createAccountCallback={createAccountCallback}
            onClose={onClose}
          />
        </div>
      </Modal>
    </Box>
  );
};

interface CopySecretModalWithTriggerProps {
  copySecretCallback: (pincode: string) => void;
}

const CopySecretModalWithTrigger: FC<CopySecretModalWithTriggerProps> = ({
  copySecretCallback,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button variant="contained" onClick={onOpen} data-cy="copy-secret-button">
        Copy Secret
      </Button>

      <Modal open={isOpen} onClose={onClose}>
        <div>
          <RequirePincodeForm
            actionCallback={copySecretCallback}
            onClose={onClose}
          />
        </div>
      </Modal>
    </Box>
  );
};

const SignOutModalContentStyles = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  minWidth: 300,
  bgcolor: 'background.paper',
  borderRadius: 2.5,
  boxShadow: 24,
  p: 4,
};

interface SignOutModalWithTriggerProps {
  signOutCallback: () => void;
}

const SignOutModalWithTrigger: FC<SignOutModalWithTriggerProps> = ({
  signOutCallback,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button variant="contained" onClick={onOpen} data-cy="sign-out-button">
        Sign Out
      </Button>

      <Modal open={isOpen} onClose={onClose}>
        <Box sx={SignOutModalContentStyles}>
          <Stack spacing={4}>
            <Typography variant="h1" sx={{ fontSize: '2rem' }}>
              Sign Out
            </Typography>

            <Typography variant="body1">
              Are you sure you want to sign out? This action will delete the
              account.
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => signOutCallback()}
                data-cy="sign-out-submit-button"
              >
                OK
              </Button>
              <Button
                variant="contained"
                onClick={onClose}
                data-cy="sign-out-cancel-button"
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

interface CopyAddressTriggerProps {
  copyAddressCallback: () => void;
}

const CopyAddressTrigger: FC<CopyAddressTriggerProps> = ({
  copyAddressCallback,
}) => {
  return (
    <Button
      variant="contained"
      onClick={copyAddressCallback}
      data-cy="copy-address-button"
    >
      Copy Address
    </Button>
  );
};

interface UpdateAccountTriggerProps {
  updateAccountCallback: () => void;
}

const UpdateAccountTrigger: FC<UpdateAccountTriggerProps> = ({
  updateAccountCallback,
}) => {
  return (
    <Button
      variant="contained"
      onClick={updateAccountCallback}
      data-cy="update-account-button"
    >
      Update Account
    </Button>
  );
};

interface MakePaymentModalWithTriggerProps {
  makePaymentCallback: (
    amount: string,
    destination: string,
    pincode: string
  ) => Promise<void>;
}

const MakePaymentModalWithTrigger: FC<MakePaymentModalWithTriggerProps> = ({
  makePaymentCallback,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button
        variant="contained"
        onClick={onOpen}
        data-cy="make-payment-button"
      >
        Make Payment
      </Button>

      <Modal open={isOpen} onClose={onClose}>
        <div>
          <MakePaymentForm
            makePaymentCallback={makePaymentCallback}
            onClose={onClose}
          />
        </div>
      </Modal>
    </Box>
  );
};

const WalletHeading: FC = () => (
  <Typography variant="h1" sx={{ fontSize: '2.5rem' }} data-cy="wallet-heading">
    Stellar Wallet
  </Typography>
);

interface WalletAccountDataProps {
  account: StellarAccount;
}

const WalletAccountData: FC<WalletAccountDataProps> = ({ account }) => (
  <Typography component="p" data-cy="wallet-account-data">
    <Typography component="span" fontWeight="bold">
      Your Public Key:
    </Typography>
    {account.publicKey}
  </Typography>
);

interface StellarAccount {
  publicKey: string;
  secretKey: string;
  state?: ServerApi.AccountRecord;
}

interface WalletLoading {
  account?: boolean;
  fund?: boolean;
  pay?: boolean;
  update?: boolean;
}

const Wallet: FC = () => {
  const [account, setAccount] = useState<StellarAccount | null>(null);
  const [loading, setLoading] = useState<WalletLoading>({
    account: true,
    fund: false,
    pay: false,
    update: false,
  });
  const { notify } = useNotificationContext();

  useEffect(() => {
    const getAccountFromStorage = async () => {
      try {
        let encodedAccount = storage.get('account');

        if (encodedAccount) {
          const account: StellarAccount = JSON.parse(atob(encodedAccount));
          const accountState = await stellar.getAccountState(account.publicKey);
          setAccount({ ...account, state: accountState });
        }

        setLoading((prevLoading) => ({ ...prevLoading, account: false }));
      } catch (error: any) {
        setLoading((prevLoading) => ({ ...prevLoading, account: false }));
        notify({
          key: 'load-account-from-storage-failure',
          severity: 'error',
          message: 'Could not access account information',
        });
      }
    };

    getAccountFromStorage();
  }, [notify]);

  const createAccount: (pincode: string) => Promise<void> = async (pincode) => {
    try {
      const account: StellarAccount = await stellar.createAccount();
      account.secretKey = JSON.stringify(
        sjcl.encrypt(pincode, account.secretKey)
      );

      const encodedAccount = btoa(
        JSON.stringify({
          publicKey: account.publicKey,
          secretKey: account.secretKey,
        })
      );

      storage.set('account', encodedAccount);

      setAccount(account);
      notify({
        key: 'create-account-success',
        severity: 'success',
        message: 'Account created',
      });
    } catch (error: any) {
      notify({
        key: 'create-account-failure',
        severity: 'error',
        message: 'Oops, something went wrong, sorry for the inconvenience',
      });
    }
  };

  const updateAccount = async () => {
    try {
      setLoading((prevLoading) => ({ ...prevLoading, update: true }));
      const accountState = await stellar.getAccountState(account!.publicKey);
      setAccount({ ...account!, state: accountState });
      setLoading((prevLoading) => ({ ...prevLoading, update: false }));
    } catch (error: any) {
      notify({
        key: 'update-account-failure',
        severity: 'error',
        message: 'Oops, something went wrong, sorry for the inconvenience',
      });
    }
  };

  const makePayment = async (
    amount: string,
    destination: string,
    pincode: string
  ) => {
    try {
      const secretKey: string = sjcl.decrypt(
        pincode,
        JSON.parse(account!.secretKey)
      );

      await stellar.makePayment(amount, destination, secretKey);

      notify({
        key: 'make-payment-success',
        severity: 'success',
        message: 'Payment success',
      });
    } catch (error: any) {
      if (stellarExceptions.isDestinationException(error)) {
        throw new FormValidationException({
          destination:
            "Account doesn't exist. Remember that Stellar Accounts must be funded before existing on the ledger.",
        });
      }

      if (encryptionExceptions.isPasswordException(error)) {
        throw new FormValidationException({ pincode: 'Invalid pincode' });
      }

      notify({
        key: 'make-payment-failure',
        severity: 'error',
        message: 'Oops, something went wrong, sorry for the inconvenience',
      });
    }
  };

  const copyAddress = () => {
    try {
      navigator.clipboard.writeText(account!.publicKey);

      notify({
        key: 'copy-address-success',
        severity: 'info',
        message: 'Copied to clipboard',
      });
    } catch (error: any) {
      notify({
        key: 'copy-address-failure',
        severity: 'error',
        message: 'Oops, something went wrong, sorry for the inconvenience',
      });
    }
  };

  const copySecret = (pincode: string) => {
    try {
      const secretKey: string = sjcl.decrypt(
        pincode,
        JSON.parse(account!.secretKey)
      );

      navigator.clipboard.writeText(secretKey);

      notify({
        key: 'copy-secret-success',
        severity: 'info',
        message: 'Copied to clipboard',
      });
    } catch (error: any) {
      if (encryptionExceptions.isPasswordException(error)) {
        throw new FormValidationException({ pincode: 'Invalid pincode' });
      }

      notify({
        key: 'copy-secret-failure',
        severity: 'error',
        message: 'Oops, something went wrong, sorry for the inconvenience',
      });
    }
  };

  const signOut = () => {
    try {
      storage.remove('account');
      setAccount(null);
      notify({
        key: 'sign-out-success',
        open: true,
        severity: 'success',
        message: 'Successfully signed out',
      });
    } catch (error: any) {
      notify({
        key: 'sign-out-failure',
        severity: 'error',
        message: 'Oops, something went wrong, sorry for the inconvenience',
      });
    }
  };

  return (
    <Box>
      {loading.account && (
        <Typography data-cy="account-load-loading-message">
          Loading...
        </Typography>
      )}

      {!loading.account && !account ? (
        <CreateAccountModalWithTrigger createAccountCallback={createAccount} />
      ) : null}

      {account ? (
        <Box data-cy="wallet">
          <Stack spacing={4}>
            <WalletHeading />
            <WalletAccountData account={account} />

            <Stack direction="row" spacing={2}>
              <CopyAddressTrigger copyAddressCallback={copyAddress} />
              <CopySecretModalWithTrigger copySecretCallback={copySecret} />
              <UpdateAccountTrigger updateAccountCallback={updateAccount} />
              <MakePaymentModalWithTrigger makePaymentCallback={makePayment} />
              <SignOutModalWithTrigger signOutCallback={signOut} />
            </Stack>
          </Stack>

          {loading.update ? (
            <Typography data-cy="account-state-update-loading-message">
              Loading...
            </Typography>
          ) : (
            <JSONPretty
              data={account.state}
              theme={monikaiTheme}
              data-cy="account-state"
            ></JSONPretty>
          )}
        </Box>
      ) : null}
    </Box>
  );
};

export default Wallet;
