import sjcl from 'sjcl';

export const isPasswordException: (error: any) => boolean = (error) => {
  return error instanceof sjcl.exception.corrupt;
};

export const isParameterInvalidException: (error: any) => boolean = (error) => {
  return error instanceof sjcl.exception.invalid;
};
