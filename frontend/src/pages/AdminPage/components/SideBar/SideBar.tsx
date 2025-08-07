import React, { useMemo } from 'react';
import * as Styled from './SideBar.styles';
import { useNavigate, useLocation } from 'react-router-dom';
import ClubLogoEditor from '@/pages/AdminPage/components/ClubLogoEditor/ClubLogoEditor';

import { logout } from '@/apis/auth/logout';

interface SideBarProps {
  clubName: string;
  clubLogo: string;
}

const tabs = [
  { label: '기본 정보 수정', path: '/admin/club-info' },
  { label: '모집 정보 수정', path: '/admin/recruit-edit' },
  { label: '활동 사진 수정', path: '/admin/photo-edit' },
  { label: '지원서 관리', path: '/admin/application-edit' },
  { label: '지원자 관리', path: '/admin/applicants' },
  { label: '계정 관리', path: '/admin/account-edit' },
];

const SideBar = ({ clubLogo, clubName }: SideBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(
    () => tabs.findIndex((tab) => location.pathname.startsWith(tab.path)),
    [location.pathname],
  );

  const handleTabClick = (tab: (typeof tabs)[number]) => {
    if (tab.label === '계정 관리') {
      alert('계정 관리 기능은 아직 준비 중이에요. ☺️');
      return;
    }
    navigate(tab.path);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm('정말 로그아웃하시겠습니까?');
    if (!confirmed) return;

    try {
      if (document.cookie.split(';').some((cookie) => cookie.trim().startsWith('refreshToken='))) {
        await logout();
      }
      localStorage.removeItem('accessToken');
      navigate('/admin/login', { replace: true });
    } catch (error) {
      alert('로그아웃에 실패했습니다.');
    }
  };

  return (
    <Styled.SidebarWrapper>
      <Styled.SidebarHeader>설정</Styled.SidebarHeader>

      <ClubLogoEditor clubLogo={clubLogo} />

      <Styled.ClubTitle>{clubName}</Styled.ClubTitle>
      <Styled.divider />

      <Styled.SidebarButtonContainer>
        {tabs.map((tab, index) => (
          <Styled.SidebarButton
            key={tab.label}
            className={activeTab === index ? 'active' : ''}
            onClick={() => handleTabClick(tab)}
          >
            {tab.label}
          </Styled.SidebarButton>
        ))}
      </Styled.SidebarButtonContainer>
      <Styled.divider />
      <Styled.SidebarButton onClick={handleLogout}>
        로그아웃
      </Styled.SidebarButton>
    </Styled.SidebarWrapper>
  );
};

export default SideBar;
