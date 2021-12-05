import { FC } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { NotificationProps } from './useNotification';

interface NotificatorProps {
  notification: NotificationProps;
  onClose: () => void;
}

const Notificator: FC<NotificatorProps> = ({ notification, onClose }) => (
  <Snackbar
    key={notification.key}
    open={notification.open}
    autoHideDuration={9000}
    onClose={onClose}
    data-cy={`notificator-${notification.key}`}
  >
    <Alert
      variant="filled"
      onClose={onClose}
      severity={notification.severity}
      sx={{ width: '100%' }}
    >
      {notification.message}
    </Alert>
  </Snackbar>
);

export default Notificator;
