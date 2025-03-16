import React from 'react';
import Header from '@/components/common/Header/Header';
import { PageContainer } from '@/styles/PageContainer.styles';
import SideBar from '@/pages/AdminPage/components/SideBar/SideBar';
import { Outlet } from 'react-router-dom';
import * as Styled from './AdminPage.styles';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import { Suspense } from 'react';

const AdminPage = () => {
  const {
    data: clubDetail,
    isLoading,
    error,
  } = useGetClubDetail('67d2e3b9b15c136c6acbf204');

  return (
    <>
      <Header />
      <PageContainer>
        <Styled.AdminPageContainer>
          <SideBar clubName={clubDetail?.name || ''} />
          <Styled.Content>
            <Suspense fallback={<div>Loading...</div>}>
              {error ? (
                <p>Error: {error.message}</p>
              ) : (
                <Outlet context={clubDetail} />
              )}
            </Suspense>
          </Styled.Content>
        </Styled.AdminPageContainer>
      </PageContainer>
    </>
  );
};

export default AdminPage;
