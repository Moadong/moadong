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
  {
    category: '기본 정보',
    items: [{ label: '기본 정보 수정', path: '/admin/club-info' }],
  },
  {
    category: '모집 정보',
    items: [
      { label: '모집 정보 수정', path: '/admin/recruit-edit' },
      { label: '활동 사진 수정', path: '/admin/photo-edit' },
    ],
  },
    {
    category: '지원 관리',
    items: [
      { label: '지원서 관리', path: '/admin/application-edit' },
      { label: '지원자 현황', path: '/admin/applicants' },
      { label: '휴지통', path: '/admin/recycle-bean'},
    ],
  },
    {
    category: '계정 관리',
    items: [
      // { label: '계정 관리', path: '/admin/account-edit' },
      { label: '아이디/비밀번호 수정', path: '/admin/account-update'},
      { label: '회원탈퇴', path: '/admin/user-delete'},
    ],
  },
];

const SideBar = ({ clubLogo, clubName }: SideBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const allItems = useMemo(() => {
    return tabs.flatMap((tab) => tab.items);
  }, []);

  const activeTab = useMemo(
    () => allItems.findIndex((item) => location.pathname.startsWith(item.path)),
    [location.pathname],
  );

  const handleTabClick = (item: (typeof allItems)[number]) => {
    if (item.label === '휴지통') {
      alert('휴지통 기능은 아직 준비 중이에요. ☺️');
      return;
    }
    if (item.label === '아이디/비밀번호 수정') {
      alert('아이디/비밀번호 수정 기능은 아직 준비 중이에요. ☺️');
      return;
    }
    if (item.label === '회원탈퇴') {
      alert('회원탈퇴 기능은 아직 준비 중이에요. ☺️');
      return;
    }
    navigate(item.path);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm('정말 로그아웃하시겠습니까?');
    if (!confirmed) return;

    try {
      if (
        document.cookie
          .split(';')
          .some((cookie) => cookie.trim().startsWith('refreshToken='))
      ) {
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
        {tabs.map((tab, tabIndex) => (
          <div key={tab.category}>
            <Styled.SidebarCategoryTitle>{tab.category}</Styled.SidebarCategoryTitle>
            {tab.items.map((item, itemIndex) => (
              <Styled.SidebarButton
                key={item.label}
                className={activeTab === itemIndex ? 'active' : ''}
                onClick={() => handleTabClick(item)}
              >
                {item.label}
              </Styled.SidebarButton>
            ))}
          </div>
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
