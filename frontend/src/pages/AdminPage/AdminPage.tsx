import React from 'react';
import Header from '@/components/common/Header/Header';
import { PageContainer } from '@/styles/PageContainer.styles';
import SideBar from '@/pages/AdminPage/components/SideBar/SideBar';
import { Outlet } from 'react-router-dom';
import * as Styled from './AdminPage.styles';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';

const AdminPage = () => {
  const {
    data: clubDetail,
    isLoading,
    error,
  } = useGetClubDetail('67d2e3b9b15c136c6acbf20b');

  if (!clubDetail) {
    return <div>Loading...</div>;
  }
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Header />
      <PageContainer>
        <Styled.AdminPageContainer>
          <SideBar clubName={clubDetail?.name || ''} />
          <Styled.Content>
            <Outlet context={clubDetail} />
          </Styled.Content>
        </Styled.AdminPageContainer>
      </PageContainer>
    </>
  );
};

export default AdminPage;
