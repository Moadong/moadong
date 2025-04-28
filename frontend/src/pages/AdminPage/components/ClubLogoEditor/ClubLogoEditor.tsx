import React, { useState, useRef, useCallback } from 'react';
import * as Styled from './ClubLogoEditor.styles';
import defaultLogo from '@/assets/images/logos/default_profile_image.svg';
import changeImageIcon from '@/assets/images/icons/change_image_button_icon.svg';
import changeImageIconHover from '@/assets/images/icons/change_image_button_icon_hover.svg';
import editIcon from '@/assets/images/icons/pencil_icon.svg';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!clubId) return null;
  const uploadMutation = useUploadClubLogo(clubId);
  const deleteMutation = useDeleteClubLogo(clubId);

  const displayedClubLogo = clubLogo ?? defaultLogo;

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > MAX_FILE_SIZE) {
        alert('파일 크기가 10MB를 초과합니다.');
        return;
      }

      uploadMutation.mutate(file, {
        onError: () => alert('로고 업로드 실패'),
      });
    },
    [uploadMutation],
  );

  const handleDeleteClick = useCallback(() => {
    if (!window.confirm('정말 로고를 초기화하시겠습니까?')) return;

    deleteMutation.mutate(undefined, {
      onError: () => alert('로고 초기화 실패'),
    });
  }, [deleteMutation]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
    setMenuOpen(false);
  }, []);

  return (
    <Styled.ClubLogoWrapper>
      <Styled.ClubLogo src={displayedClubLogo} alt='Club Logo' />

      <Styled.EditButton onClick={() => setMenuOpen((prev) => !prev)}>
        <img
          src={menuOpen ? changeImageIconHover : changeImageIcon}
          alt='로고 수정'
        />
      </Styled.EditButton>

      {menuOpen && (
        <Styled.EditMenu>
          <Styled.EditMenuItem onClick={handleUploadClick}>
            <img src={editIcon} alt='사진 수정 아이콘' />
            사진 수정하기
          </Styled.EditMenuItem>

          <Styled.Divider />

          <Styled.EditMenuItem onClick={handleDeleteClick}>
            <img src={deleteIcon} alt='초기화 아이콘' />
            초기화하기
          </Styled.EditMenuItem>
        </Styled.EditMenu>
      )}

      <Styled.HiddenFileInput
        type='file'
        ref={fileInputRef}
        accept='image/*'
        onChange={handleFileChange}
      />
    </Styled.ClubLogoWrapper>
  );
};

export default ClubLogoEditor;
