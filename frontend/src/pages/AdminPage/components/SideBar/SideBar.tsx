import React from 'react';
import * as Styled from './SideBar.styles';
import defaultLogo from '@/assets/images/logos/default_profile_image.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutButton from '@/pages/AdminPage/components/LogoutButton/LogoutButton';

interface SideBarProps {
  clubName: string;
}

const tabs = [
  { label: '동아리 정보 및 태그', path: '/admin/club-info' },
  { label: '소개 정보 수정', path: '/admin/recruit-edit' },
  { label: '회원 정보 관리', path: '/admin/account-edit' },
];

const SideBar = ({ clubName }: SideBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = React.useMemo(
    () => tabs.findIndex((tab) => location.pathname.startsWith(tab.path)),
    [location.pathname],
  );

  const handleTabClick = (tab: (typeof tabs)[number], index: number) => {
    if (tab.label === '회원 정보 관리') {
      alert('회원 정보 관리 탭은 준비 중입니다☺️');
      return;
    }
    navigate(tab.path);
  };

  return (
    <Styled.SidebarWrapper>
      <Styled.SidebarHeader>설정</Styled.SidebarHeader>
      <Styled.ClubLogo src={defaultLogo} alt='Club Logo' />
      <Styled.ClubTitle>{clubName}</Styled.ClubTitle>
      <Styled.divider />

      <Styled.SidebarButtonContainer>
        {tabs.map((tab, index) => (
          <Styled.SidebarButton
            key={tab.label}
            className={activeTab === index ? 'active' : ''}
            onClick={() => handleTabClick(tab, index)}>
            {tab.label}
          </Styled.SidebarButton>
        ))}
      </Styled.SidebarButtonContainer>
      <div style={{ marginTop: 'auto' }}>
        <LogoutButton />
      </div>
    </Styled.SidebarWrapper>
  );
};

export default SideBar;
