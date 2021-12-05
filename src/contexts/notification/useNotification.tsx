import { useState, useCallback } from 'react';
import { SnackbarProps } from '@mui/material/Snackbar';

export interface NotificationProps extends SnackbarProps {
  severity?: 'error' | 'success' | 'info' | 'warning';
}

const useNotification = () => {
  const [notification, setNotification] = useState<NotificationProps>({
    open: false,
  });

  const notify: (notificationProps: NotificationProps) => void = useCallback(
    (notificationProps) => {
      setNotification({ ...notificationProps, open: true });
    },
    []
  );

  const close: () => void = () => setNotification({ open: false });

  return { notification, notify, close };
};

export default useNotification;
