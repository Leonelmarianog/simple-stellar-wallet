import { FC, createContext } from 'react';
import useNotification, { NotificationProps } from './useNotification';
import Notificator from './Notificator';

interface NotificationContextProps {
  notification: NotificationProps;
  notify: (notificationProps: NotificationProps) => void;
}

export const NotificationContext = createContext<NotificationContextProps>({
  notification: {},
  notify: () => {},
});

export const NotificationProvider: FC = ({ children }) => {
  const { notification, notify, close } = useNotification();

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      <Notificator notification={notification} onClose={close} />
      {children}
    </NotificationContext.Provider>
  );
};
