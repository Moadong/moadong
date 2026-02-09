import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from '@/components/common/Spinner/Spinner';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { useAdminClubContext } from '@/context/AdminClubContext';
import useAuth from '@/hooks/useAuth';

// import { useGetApplicants } from '@/hooks/queries/applicants/useGetApplicants';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, clubId } = useAuth();
  const { setClubId, setHasConsented } = useAdminClubContext();
  // const { setClubId, setApplicantsData } = useAdminClubContext();
  // const { data: applicantsData } = useGetApplicants(clubId ?? '');

  useEffect(() => {
    if (clubId) {
      setClubId(clubId);
      const consented =
        localStorage.getItem(STORAGE_KEYS.HAS_CONSENTED_PERSONAL_INFO) ===
        'true';
      setHasConsented(consented);
    }
  }, [clubId, setClubId, setHasConsented]);

  // useEffect(() => {
  //   if (clubId && applicantsData) {
  //     setApplicantsData(applicantsData);
  //   }
  // }, [clubId, applicantsData]);

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to='/admin/login' replace />;

  return <>{children}</>;
};

export default PrivateRoute;
