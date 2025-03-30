import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getClubIdByToken } from '@/apis/auth/getClubIdByToken';
// import { ClubContext } from '@/context/ClubContext'; // 연결 예정

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [clubId, setClubId] = useState<string | null>(null);

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
  }, []);

  if (!authChecked) return <div>로딩 중...</div>;

  if (!authorized) return <Navigate to='/admin/login' replace />;

  return (
    // TODO: ClubContext.Provider로 감싸기 (Context 구현되면 주석 해제)
    // <ClubContext.Provider value={{ clubId }}>
    <>{children}</>
    // </ClubContext.Provider>
  );
};

export default PrivateRoute;
