import React from 'react';
import Header from '@/components/common/Header/Header';
import { PageContainer } from '@/styles/PageContainer.styles';
import SideBar from '@/pages/AdminPage/components/SideBar/SideBar';
import { Outlet } from 'react-router-dom';
import * as Styled from './AdminPage.styles';

const AdminPage = () => {
  return (
    <>
      <Header />
      <PageContainer>
        <Styled.AdminPageContainer>
          <SideBar />
          <Styled.Content>
            <Outlet />
          </Styled.Content>
        </Styled.AdminPageContainer>
      </PageContainer>
    </>
  );
};

export default AdminPage;
