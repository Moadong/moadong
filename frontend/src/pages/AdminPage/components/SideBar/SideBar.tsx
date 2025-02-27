import React from 'react';
import * as Styled from './SideBar.styles';
import defaultLogo from '@/assets/images/defaultLogo.png';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { label: '동아리 정보 및 태그', path: '/admin/club-info' },
  { label: '소개 정보 수정', path: '/admin/recruit-edit' },
  { label: '회원 정보 관리', path: '/admin/account-edit' },
];

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = React.useMemo(
    () => tabs.findIndex((tab) => location.pathname.startsWith(tab.path)),
    [location.pathname],
  );

  return (
    <Styled.SidebarWrapper>
      <Styled.SidebarHeader>설정</Styled.SidebarHeader>
      <Styled.ClubLogo src={defaultLogo} alt='Club Logo' />
      <Styled.ClubTitle>WAP</Styled.ClubTitle>
      <Styled.divider />

      <Styled.SidebarButtonContainer>
        {tabs.map((tab, index) => (
          <Styled.SidebarButton
            key={tab.label}
            className={activeTab === index ? 'active' : ''}
            onClick={() => navigate(tab.path)}>
            {tab.label}
          </Styled.SidebarButton>
        ))}
      </Styled.SidebarButtonContainer>
    </Styled.SidebarWrapper>
  );
};

export default SideBar;
