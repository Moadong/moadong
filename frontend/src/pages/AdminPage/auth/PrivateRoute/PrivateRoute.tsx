import { useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useAdminClubContext } from '@/context/AdminClubContext';
import Spinner from '@/components/common/Spinner/Spinner';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, clubId } = useAuth();
  const { setClubId } = useAdminClubContext();

  useEffect(() => {
    if (clubId) setClubId(clubId);
  }, [clubId, setClubId]);

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to='/admin/login' replace />;

  return <>{children}</>;
};

export default PrivateRoute;
