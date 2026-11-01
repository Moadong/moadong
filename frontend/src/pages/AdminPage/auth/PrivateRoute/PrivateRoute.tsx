import { Navigate } from 'react-router-dom';
import Spinner from '@/components/common/Spinner/Spinner';
import useAuth from '@/hooks/useAuth';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to='/admin/login' replace />;

  return <>{children}</>;
};

export default PrivateRoute;
