import React, { useRef } from 'react';
import defaultLogo from '@/assets/images/logos/default_profile_image.svg';
import { ADMIN_EVENT } from '@/constants/eventName';
import { MAX_FILE_SIZE } from '@/constants/uploadLimit';
import { useAdminClubContext } from '@/context/AdminClubContext';
import {
  useDeleteLogo,
  useUploadLogo,
} from '@/hooks/Queries/useClubImages';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import * as Styled from './ClubLogoEditor.styles';

interface ClubLogoEditorProps {
  clubLogo?: string | null;
}

const ClubLogoEditor = ({ clubLogo }: ClubLogoEditorProps) => {
  const trackEvent = useMixpanelTrack();

  const { clubId } = useAdminClubContext();
  if (!clubId) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadLogo();
  const deleteMutation = useDeleteLogo();

  const isClubLogoEmpty = !clubLogo || clubLogo.trim() === '';
  const displayedLogo = isClubLogoEmpty ? defaultLogo : clubLogo;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    e.target.value = '';

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기가 너무 커요! 10MB 이하 이미지만 업로드할 수 있어요.');
      return;
    }

    trackEvent(ADMIN_EVENT.CLUB_LOGO_UPLOAD_BUTTON_CLICKED);
    uploadMutation.mutate({ clubId, file });
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

    trackEvent(ADMIN_EVENT.CLUB_LOGO_RESET_BUTTON_CLICKED);
    deleteMutation.mutate(clubId);
  };

  return (
    <div>
      <Styled.Label>로고</Styled.Label>
      <Styled.ContentWrapper>
        <Styled.ClubLogoWrapper>
          <Styled.ClubLogo src={displayedLogo} alt='Club Logo' />
        </Styled.ClubLogoWrapper>

        <Styled.ButtonTextGroup>
          <Styled.ButtonGroup>
            <Styled.UploadButton onClick={triggerFileInput}>
              이미지 수정
            </Styled.UploadButton>

            {!isClubLogoEmpty && (
              <Styled.ResetButton onClick={handleLogoReset}>
                초기화
              </Styled.ResetButton>
            )}
          </Styled.ButtonGroup>

          <Styled.HelpText>동아리 로고 이미지를 넣어주세요.</Styled.HelpText>
        </Styled.ButtonTextGroup>

        <Styled.HiddenFileInput
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileSelect}
        />
      </Styled.ContentWrapper>
    </div>
  );
};

export default ClubLogoEditor;
