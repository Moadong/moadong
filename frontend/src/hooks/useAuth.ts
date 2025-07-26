import { useEffect, useState } from 'react';
import { getClubIdByToken } from '@/apis/auth/getClubIdByToken';

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const clubId = await getClubIdByToken();
        setClubId(clubId);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        setClubId(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isLoading, isAuthenticated, clubId };
};

export default useAuth;
