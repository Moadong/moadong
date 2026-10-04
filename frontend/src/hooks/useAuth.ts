import { useEffect, useState } from 'react';
import { getClubIdByToken } from '@/apis/auth';
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
      } catch {
        // 남겨 두면 공개 동아리 상세에서 이전 동아리의 관리자 버튼이 계속 보인다.
        setClubId(null);
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
