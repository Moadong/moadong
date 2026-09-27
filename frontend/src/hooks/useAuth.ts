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
