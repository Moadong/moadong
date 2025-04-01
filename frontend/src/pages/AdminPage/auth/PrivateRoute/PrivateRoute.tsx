import { useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useClubContext } from '@/context/clubContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, clubId } = useAuth();
  const { setClubId } = useClubContext();

  useEffect(() => {
    if (clubId) setClubId(clubId);
  }, [clubId, setClubId]);

  if (isLoading) return <div>로딩 중...</div>;
  if (!isAuthenticated) return <Navigate to='/admin/login' replace />;

  return <>{children}</>;
};

export default PrivateRoute;
