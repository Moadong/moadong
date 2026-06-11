import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from '@/components/common/Spinner/Spinner';
import useAuth from '@/hooks/useAuth';
import { useAdminClubId } from '@/store/useAdminClubStore';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, clubId } = useAuth();
  const { clubId: storeClubId, setClubId } = useAdminClubId();

  useEffect(() => {
    if (clubId) {
      setClubId(clubId);
    }
  }, [clubId, setClubId]);

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to='/admin/login' replace />;
  if (clubId && storeClubId !== clubId) return <Spinner />;

  return <>{children}</>;
};

export default PrivateRoute;
