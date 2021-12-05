import Wallet from './Wallet';
import { NotificationProvider } from '../contexts/notification/NotificationContext';

const App = () => {
  return (
    <NotificationProvider>
      <Wallet />
    </NotificationProvider>
  );
};

export default App;
