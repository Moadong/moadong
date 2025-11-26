import React from 'react';
import Header from '@/components/common/Header/Header';
import { PageContainer } from '@/styles/PageContainer.styles';
import SideBar from '@/pages/AdminPage/components/SideBar/SideBar';
import MobileSideBar from '@/pages/AdminPage/components/MobileSideBar/MobileSideBar';
import { Outlet } from 'react-router-dom';
import * as Styled from './AdminPage.styles';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import { useAdminClubContext } from '@/context/AdminClubContext';
import { Divider } from './components/SideBar/SideBar.styles';

const AdminPage = () => {
  const { clubId } = useAdminClubContext();
  const { data: clubDetail, error } = useGetClubDetail(clubId || '');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  if (!clubDetail) {
    return null;
  }

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Header />
      <PageContainer>
        <Styled.AdminPageContainer>
          <Styled.DesktopSideBarWrapper>
            <SideBar
              clubLogo={clubDetail?.logo}
              clubName={clubDetail?.name || ''}
            />
          </Styled.DesktopSideBarWrapper>
          <Styled.Divider />
          <Styled.Content>
            <Outlet context={clubDetail} />
          </Styled.Content>
        </Styled.AdminPageContainer>
      </PageContainer>

      <MobileSideBar
        clubLogo={clubDetail?.logo}
        clubName={clubDetail?.name || ''}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <Styled.MobileMenuButton onClick={() => setIsMobileSidebarOpen(true)}>
        ☰
      </Styled.MobileMenuButton>
    </>
  );
};

export default AdminPage;
