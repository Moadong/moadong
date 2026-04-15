import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from '@/components/common/Spinner/Spinner';
import useAuth from '@/hooks/useAuth';
import { useAdminClubId } from '@/store/useAdminClubStore';

// import { useGetApplicants } from '@/hooks/queries/applicants/useGetApplicants';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, clubId } = useAuth();
  const { setClubId } = useAdminClubId();
  // const { data: applicantsData } = useGetApplicants(clubId ?? '');

  useEffect(() => {
    if (clubId) {
      setClubId(clubId);
    }
  }, [clubId, setClubId]);

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
