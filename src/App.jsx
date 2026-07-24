import AppRoutes from './routes/AppRoutes';
import ToastProvider from './components/Common/ToastProvider';
import './styles/pages.css';

function App() {
  return (
    <>
      <AppRoutes />
      <ToastProvider />
    </>
  );
}

export default App;
