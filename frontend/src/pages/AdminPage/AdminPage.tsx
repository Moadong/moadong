import { Outlet } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import { useAdminClubContext } from '@/context/AdminClubContext';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import PersonalInfoConsentModal from '@/pages/AdminPage/components/PersonalInfoConsentModal/PersonalInfoConsentModal';
import SideBar from '@/pages/AdminPage/components/SideBar/SideBar';
import * as Styled from './AdminPage.styles';

const AdminPage = () => {
  const { clubId, hasConsented } = useAdminClubContext();
  const { data: clubDetail, error } = useGetClubDetail(clubId || '');

  if (!clubDetail) {
    return null;
  }

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Header />
      {!hasConsented && <PersonalInfoConsentModal clubName={clubDetail.name} />}
      <Styled.Background>
        <Styled.Layout>
          <SideBar />
          <Styled.MainContent>
            <Outlet context={clubDetail} />
          </Styled.MainContent>
        </Styled.Layout>
      </Styled.Background>
    </>
  );
};

export default AdminPage;
