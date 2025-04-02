import React, { useMemo } from 'react';
import * as Styled from './SideBar.styles';
import defaultLogo from '@/assets/images/logos/default_profile_image.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutButton from '@/pages/AdminPage/components/LogoutButton/LogoutButton';
import { useAdminClubContext } from '@/context/AdminClubContext';
import changeImageIcon from '@/assets/images/icons/change_image_button_icon.svg';
import deleteImageIcon from '@/assets/images/icons/delete_button_icon.svg';
import {
  useUploadClubLogo,
  useDeleteClubLogo,
} from '@/hooks/queries/club/useClubLogo';

interface SideBarProps {
  clubName: string;
  clubLogo: string;
}

const tabs = [
  { label: '동아리 정보 및 태그', path: '/admin/club-info' },
  { label: '소개 정보 수정', path: '/admin/recruit-edit' },
  { label: '회원 정보 관리', path: '/admin/account-edit' },
];

const SideBar = ({ clubLogo, clubName }: SideBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clubId } = useAdminClubContext();

  if (!clubId) return null;
  const uploadMutation = useUploadClubLogo(clubId);
  const deleteMutation = useDeleteClubLogo(clubId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file, {
      onError: () => {
        alert('로고 업로드 실패');
      },
    });
  };

  const handleDeleteClick = () => {
    if (!window.confirm('정말 로고를 초기화하시겠습니까?')) return;

    deleteMutation.mutate(undefined, {
      onError: () => {
        alert('로고 초기화 실패');
      },
    });
  };

  const activeTab = useMemo(
    () => tabs.findIndex((tab) => location.pathname.startsWith(tab.path)),
    [location.pathname],
  );

  const handleTabClick = (tab: (typeof tabs)[number]) => {
    if (tab.label === '회원 정보 관리') {
      alert('회원 정보 관리 탭은 준비 중입니다☺️');
      return;
    }
    navigate(tab.path);
  };

  return (
    <Styled.SidebarWrapper>
      <Styled.SidebarHeader>설정</Styled.SidebarHeader>

      <Styled.ClubLogoWrapper>
        <Styled.ClubLogo src={clubLogo || defaultLogo} alt='Club Logo' />
        <Styled.EditLabel htmlFor='logo-upload'>
          <Styled.LogoEditIcon src={changeImageIcon} alt='Edit Logo' />
        </Styled.EditLabel>
        <input
          type='file'
          id='logo-upload'
          accept='image/*'
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <Styled.LogoDeleteIcon
          src={deleteImageIcon}
          alt='Delete Logo'
          onClick={handleDeleteClick}
        />
      </Styled.ClubLogoWrapper>

      <Styled.ClubTitle>{clubName}</Styled.ClubTitle>
      <Styled.divider />

      <Styled.SidebarButtonContainer>
        {tabs.map((tab, index) => (
          <Styled.SidebarButton
            key={tab.label}
            className={activeTab === index ? 'active' : ''}
            onClick={() => handleTabClick(tab)}>
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
