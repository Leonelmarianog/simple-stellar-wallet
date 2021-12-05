import { FC, MouseEventHandler, useState } from 'react';
import { useField } from 'formik';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface Props {
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  dataCy?: string;
}

const PasswordInput: FC<Props> = ({
  label,
  name,
  placeholder,
  required,
  dataCy,
}) => {
  const [field, meta] = useField(name);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [didFocus, setDidFocus] = useState(false);

  const isInvalid = Boolean(meta.error);
  const wasTouched = meta.touched;
  const isTyping = didFocus && field.value.length > 1;
  const showError = isInvalid && (isTyping || wasTouched);

  const handleFocus: () => void = () => {
    setDidFocus(true);
  };

  const handleClickShowPassword: () => void = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleMouseDownPassword: MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      id={name}
      type={isPasswordVisible ? 'text' : 'password'}
      label={label}
      placeholder={placeholder}
      required={required}
      onFocus={handleFocus}
      {...field}
      error={showError}
      helperText={showError && meta.error}
      variant="standard"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              data-cy={`${dataCy}-visibility`}
            >
              {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      data-cy={dataCy}
    />
  );
};

export default PasswordInput;
