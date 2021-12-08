import { FC, MouseEventHandler } from 'react';
import { Formik, Form, useFormikContext, FormikHelpers } from 'formik';
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

interface RequirePincodeProps {
  handleCancel: MouseEventHandler<HTMLButtonElement>;
}

const RequirePincode: FC<RequirePincodeProps> = ({ handleCancel }) => {
  const { isValid, dirty, isSubmitting } = useFormikContext();

  return (
    <Box sx={formStyles}>
      <Form>
        <Stack spacing={2.5}>
          <Typography
            variant="h1"
            sx={headingStyles}
            data-cy="require-pincode-heading"
          >
            Enter Pincode to proceed with this action
          </Typography>

          <Stack spacing={4}>
            <Stack spacing={2}>
              <PasswordInput
                label="Pincode"
                name="pincode"
                placeholder="Enter Pincode"
                required
                dataCy="require-pincode-pincode"
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={!(dirty && isValid)}
                data-cy="require-pincode-submit"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
              <Button
                variant="contained"
                onClick={handleCancel}
                data-cy="require-pincode-cancel"
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

interface RequirePincodeContainerProps {
  actionCallback: (pincode: string) => void;
  onClose: () => void;
}

interface FormValues {
  pincode: string;
}

const RequirePincodeFormContainer: FC<RequirePincodeContainerProps> = ({
  actionCallback,
  onClose,
}) => {
  const handleSubmit = (
    values: FormValues,
    { setErrors, setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      actionCallback(values.pincode);
      setSubmitting(false);
      onClose();
    } catch (error: any) {
      setSubmitting(false);
      setErrors(error.errors);
    }
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = () => {
    onClose();
  };

  const initialValues: FormValues = { pincode: '' };

  const validationSchema = Yup.object({
    pincode: Yup.string().required('Pincode required'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <RequirePincode handleCancel={handleCancel} />
    </Formik>
  );
};

export default RequirePincodeFormContainer;
