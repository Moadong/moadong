import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getClubIdByToken } from '@/apis/auth/getClubIdByToken';
import { useClubContext } from '@/context/clubContext';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const { setClubId } = useClubContext();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const clubId = await getClubIdByToken();
        setClubId(clubId);
        setAuthorized(true);
      } catch {
        setAuthorized(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [setClubId]);

  if (!authChecked) return <div>로딩 중...</div>;
  if (!authorized) return <Navigate to='/admin/login' replace />;

  return <>{children}</>;
};

export default PrivateRoute;
