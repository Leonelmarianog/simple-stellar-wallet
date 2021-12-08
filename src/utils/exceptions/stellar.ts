export const isDestinationException: (error: any) => boolean = (error) => {
  return (
    error.response !== undefined &&
    error.response.data.status === 400 &&
    error.response.data.extras &&
    error.response.data.extras.result_codes.operations.indexOf(
      'op_no_destination'
    ) !== -1
  );
};
