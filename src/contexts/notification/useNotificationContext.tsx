import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

const useNotificationContext = () => useContext(NotificationContext);

export default useNotificationContext;
