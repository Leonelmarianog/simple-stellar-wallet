import { FC, useState } from 'react';
import { useField } from 'formik';
import TextField from '@mui/material/TextField';

interface Props {
  type: string;
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  dataCy?: string;
}

const SimpleInput: FC<Props> = ({
  type,
  label,
  name,
  placeholder,
  required,
  dataCy,
}) => {
  const [field, meta] = useField(name);
  const [didFocus, setDidFocus] = useState(false);

  const isInvalid = Boolean(meta.error);
  const wasTouched = meta.touched;
  const isTyping = didFocus && field.value.length > 1;
  const showError = isInvalid && (isTyping || wasTouched);

  const handleFocus: () => void = () => {
    setDidFocus(true);
  };

  return (
    <TextField
      id={name}
      type={type}
      label={label}
      placeholder={placeholder}
      required={required}
      onFocus={handleFocus}
      {...field}
      error={showError}
      helperText={showError && meta.error}
      variant="standard"
      fullWidth
      data-cy={dataCy}
    />
  );
};

export default SimpleInput;
