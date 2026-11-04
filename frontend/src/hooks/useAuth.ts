import { useEffect, useState } from 'react';
import { getClubIdByToken } from '@/apis/auth';
import { NetworkError } from '@/errors';
import { useAdminClubStore } from '@/store/useAdminClubStore';

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setClubId = useAdminClubStore((state) => state.setClubId);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const clubId = await getClubIdByToken();
        setClubId(clubId);
        setIsAuthenticated(true);
      } catch (error) {
        // 인증이 무효면 지운다. 남겨 두면 이전 동아리 clubId가 계속 남는다.
        // 네트워크 오류는 인증 실패가 아니라서 지우지 않는다. 지우면 persist된 값이 사라져 다시 연결돼도 복원되지 않는다.
        if (!(error instanceof NetworkError)) setClubId(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setClubId]);

  return { isLoading, isAuthenticated };
};

export default useAuth;
