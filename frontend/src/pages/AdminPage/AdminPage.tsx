import Header from '@/components/common/Header/Header';
import SideBar from '@/pages/AdminPage/components/SideBar/SideBar';
import { Outlet } from 'react-router-dom';

import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import { useAdminClubContext } from '@/context/AdminClubContext';
import * as Styled from './AdminPage.styles';

const AdminPage = () => {
  const { clubId } = useAdminClubContext();
  const { data: clubDetail, error } = useGetClubDetail(clubId || '');

  if (!clubDetail) {
    return null;
  }

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Header />
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
