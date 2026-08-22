import { Navigate } from 'react-router-dom';
import useStore from '../store/authStore';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
