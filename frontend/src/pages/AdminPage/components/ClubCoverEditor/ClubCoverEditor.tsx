import { useRef } from 'react';
import defaultCover from '@/assets/images/logos/default_profile_image.svg';
import { ADMIN_EVENT } from '@/constants/eventName';
import { MAX_FILE_SIZE } from '@/constants/uploadLimit';
import { useAdminClubContext } from '@/context/AdminClubContext';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useDeleteCover, useUploadCover } from '@/hooks/Queries/useClubCover';
import * as Styled from './ClubCoverEditor.styles';

interface ClubCoverEditorProps {
  coverImage?: string | null;
}

const ClubCoverEditor = ({ coverImage }: ClubCoverEditorProps) => {
  const trackEvent = useMixpanelTrack();
  const { clubId } = useAdminClubContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!clubId) return null;

  const uploadMutation = useUploadCover();
  const deleteMutation = useDeleteCover();

  const isCoverImageEmpty = !coverImage?.trim();
  const displayedCover: string = isCoverImageEmpty
    ? defaultCover
    : (coverImage ?? defaultCover);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    e.target.value = '';

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기가 너무 커요! 10MB 이하 이미지만 업로드할 수 있어요.');
      return;
    }

    trackEvent(ADMIN_EVENT.CLUB_COVER_UPLOAD_BUTTON_CLICKED);
    uploadMutation.mutate(
      { clubId, file },
      {
        onError: () => {
          alert('커버 이미지 업로드에 실패했어요. 다시 시도해주세요!');
        },
      },
    );
  };

  const triggerFileInput = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleCoverReset = () => {
    if (isCoverImageEmpty) {
      alert('이미 기본 커버 이미지예요!');
      return;
    }

    if (!window.confirm('정말 커버 이미지를 기본 이미지로 되돌릴까요?')) return;

    trackEvent(ADMIN_EVENT.CLUB_COVER_RESET_BUTTON_CLICKED);
    deleteMutation.mutate(clubId, {
      onError: () => {
        alert('커버 이미지 초기화에 실패했어요. 다시 시도해주세요!');
      },
    });
  };

  return (
    <div>
      <Styled.Label>커버 이미지</Styled.Label>
      <Styled.ContentWrapper>
        <Styled.CoverImageWrapper>
          <Styled.CoverImage src={displayedCover} alt='Cover Image' />
        </Styled.CoverImageWrapper>

        <Styled.ButtonTextGroup>
          <Styled.ButtonGroup>
            <Styled.UploadButton onClick={triggerFileInput}>
              이미지 수정
            </Styled.UploadButton>

            {!isCoverImageEmpty && (
              <Styled.ResetButton onClick={handleCoverReset}>
                초기화
              </Styled.ResetButton>
            )}
          </Styled.ButtonGroup>

          <Styled.HelpText>
            동아리 커버 이미지를 넣어주세요. (권장 비율: 375:213)
          </Styled.HelpText>
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

export default ClubCoverEditor;
