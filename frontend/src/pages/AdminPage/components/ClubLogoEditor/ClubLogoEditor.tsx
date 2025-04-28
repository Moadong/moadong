import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as Styled from './ClubLogoEditor.styles';
import defaultLogo from '@/assets/images/logos/default_profile_image.svg';
import changeImageIcon from '@/assets/images/icons/change_image_button_icon.svg';
import changeImageIconHover from '@/assets/images/icons/change_image_button_icon_hover.svg';
import editIcon from '@/assets/images/icons/pencil_icon_2.svg';
import deleteIcon from '@/assets/images/icons/cancel_button_icon.svg';
import {
  useUploadClubLogo,
  useDeleteClubLogo,
} from '@/hooks/queries/club/useClubLogo';
import { useAdminClubContext } from '@/context/AdminClubContext';
import { MAX_FILE_SIZE } from '@/constants/uploadLimit';

interface ClubLogoEditorProps {
  clubLogo?: string | null;
}

const ClubLogoEditor = ({ clubLogo }: ClubLogoEditorProps) => {
  const { clubId } = useAdminClubContext();
  if (!clubId) return null;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadClubLogo(clubId);
  const deleteMutation = useDeleteClubLogo(clubId);

  const isClubLogoEmpty = !clubLogo || clubLogo.trim() === '';
  const displayedLogo = isClubLogoEmpty ? defaultLogo : clubLogo;

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기가 너무 커요! 10MB 이하 이미지만 업로드할 수 있어요.');
      return;
    }

    uploadMutation.mutate(file, {
      onError: () => alert('로고 업로드에 실패했어요. 다시 시도해주세요!'),
    });
  };

  const triggerFileInput = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleLogoReset = () => {
    if (isClubLogoEmpty) {
      alert('이미 기본 로고예요!');
      return;
    }

    if (!window.confirm('정말 로고를 기본 이미지로 되돌릴까요?')) return;

    deleteMutation.mutate(undefined, {
      onError: () =>
        alert('로고 초기화에 실패했어요. 잠시 후 다시 시도해 주세요.'),
    });
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <Styled.ClubLogoWrapper>
      <Styled.ClubLogo src={displayedLogo} alt='Club Logo' />

      <Styled.EditButton onClick={toggleMenu}>
        <img
          src={isMenuOpen ? changeImageIconHover : changeImageIcon}
          alt='로고 수정'
        />
      </Styled.EditButton>

      {isMenuOpen && (
        <Styled.EditMenu ref={menuRef}>
          <Styled.EditMenuItem
            onClick={() => {
              triggerFileInput();
              setIsMenuOpen(false);
            }}>
            <img src={editIcon} alt='사진 수정 아이콘' />
            사진 수정하기
          </Styled.EditMenuItem>

          <Styled.Divider />

          <Styled.EditMenuItem
            onClick={() => {
              handleLogoReset();
              setIsMenuOpen(false);
            }}>
            <img src={deleteIcon} alt='초기화 아이콘' />
            초기화하기
          </Styled.EditMenuItem>
        </Styled.EditMenu>
      )}

      <Styled.HiddenFileInput
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileSelect}
      />
    </Styled.ClubLogoWrapper>
  );
};

export default ClubLogoEditor;
