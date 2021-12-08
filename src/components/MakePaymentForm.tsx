import { FC, MouseEventHandler } from 'react';
import { Formik, Form, useFormikContext, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SimpleInput from './formik/SimpleInput';

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

interface MakePaymentFormProps {
  handleCancel: MouseEventHandler<HTMLButtonElement>;
}

const MakePaymentForm: FC<MakePaymentFormProps> = ({ handleCancel }) => {
  const { isValid, dirty, isSubmitting } = useFormikContext();

  return (
    <Box sx={formStyles}>
      <Form>
        <Stack spacing={2.5}>
          <Typography
            variant="h1"
            sx={{ fontSize: '2rem' }}
            data-cy="make-payment-form-heading"
          >
            Make Payment
          </Typography>

          <Stack spacing={4}>
            <Stack spacing={2}>
              <SimpleInput
                type="number"
                label="Amount (XLM)"
                name="amount"
                placeholder="Amount (XLM)"
                required
                dataCy="make-payment-form-amount"
              />
              <SimpleInput
                type="text"
                label="Destination"
                name="destination"
                placeholder="Destination"
                required
                dataCy="make-payment-form-destination"
              />
              <SimpleInput
                type="text"
                label="Pincode"
                name="pincode"
                placeholder="Pincode"
                required
                dataCy="make-payment-form-pincode"
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={!(dirty && isValid) || isSubmitting}
                data-cy="make-payment-form-submit"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
              <Button
                variant="contained"
                onClick={handleCancel}
                data-cy="make-payment-form-cancel"
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

interface MakePaymentFormContainerProps {
  makePaymentCallback: (
    amount: string,
    destination: string,
    pincode: string
  ) => void;
  onClose: () => void;
}

interface FormValues {
  amount: number;
  destination: string;
  pincode: string;
}

const MakePaymentFormContainer: FC<MakePaymentFormContainerProps> = ({
  makePaymentCallback,
  onClose,
}) => {
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    await makePaymentCallback(
      String(values.amount),
      values.destination,
      values.pincode
    );
    onClose();
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = () => {
    onClose();
  };

  const initialValues: FormValues = { amount: 0, destination: '', pincode: '' };

  const validationSchema = Yup.object({
    amount: Yup.number().moreThan(0).required('Amount required'),
    destination: Yup.string().required('Destination required'),
    pincode: Yup.string().required('Pincode required'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <MakePaymentForm handleCancel={handleCancel} />
    </Formik>
  );
};

export default MakePaymentFormContainer;
