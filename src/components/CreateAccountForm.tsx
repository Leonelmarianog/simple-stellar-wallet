import { FC, MouseEventHandler } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PasswordInput from './formik/PasswordInput';

const formStyles = {
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

const headingStyles = {
  fontSize: '2rem',
};

interface CreateAccountFormProps {
  handleCancel: MouseEventHandler<HTMLButtonElement>;
}

const CreateAccountForm: FC<CreateAccountFormProps> = ({ handleCancel }) => {
  const { isValid, dirty, isSubmitting } = useFormikContext();

  return (
    <Box sx={formStyles}>
      <Form>
        <Stack spacing={2.5}>
          <Typography
            variant="h1"
            sx={headingStyles}
            data-cy="create-account-heading"
          >
            Account Creation
          </Typography>

          <Stack spacing={4}>
            <Stack spacing={2}>
              <PasswordInput
                label="Pincode"
                name="pincode"
                placeholder="Enter Pincode"
                required
                dataCy="create-account-pincode"
              />
              <PasswordInput
                label="Confirm Pincode"
                name="pincodeConfirm"
                placeholder="Confirm Pincode"
                required
                dataCy="create-account-pincode-confirm"
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={!(dirty && isValid)}
                data-cy="create-account-submit"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
              <Button
                variant="contained"
                onClick={handleCancel}
                data-cy="create-account-cancel"
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Form>
    </Box>
  );
};

interface CreateAccountFormContainerProps {
  createAccountCallback: (pincode: string) => Promise<void>;
  onClose: () => void;
}

interface FormValues {
  pincode: string;
  pincodeConfirm: string;
}

const CreateAccountFormContainer: FC<CreateAccountFormContainerProps> = ({
  createAccountCallback,
  onClose,
}) => {
  const handleSubmit = async (values: FormValues) => {
    await createAccountCallback(values.pincode);
    onClose();
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = () => {
    onClose();
  };

  const initialValues: FormValues = { pincode: '', pincodeConfirm: '' };

  const validationSchema = Yup.object({
    pincode: Yup.string().required('Pincode required'),
    pincodeConfirm: Yup.string()
      .oneOf([Yup.ref('pincode')], 'Pincode does not match')
      .required('Must confirm pincode'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <CreateAccountForm handleCancel={handleCancel} />
    </Formik>
  );
};

export default CreateAccountFormContainer;
