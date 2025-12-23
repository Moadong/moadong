import { useRef } from 'react';
import defaultCover from '@/assets/images/logos/default_profile_image.svg';
import { ADMIN_EVENT } from '@/constants/eventName';
import { MAX_FILE_SIZE } from '@/constants/uploadLimit';
import { useAdminClubContext } from '@/context/AdminClubContext';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './ClubCoverEditor.styles';

interface ClubCoverEditorProps {
  coverImage?: string | null;
}

const ClubCoverEditor = ({ coverImage }: ClubCoverEditorProps) => {
  const trackEvent = useMixpanelTrack();
  const { clubId } = useAdminClubContext();

  if (!clubId) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // TODO: useCoverMutation 추가 예정
  // const uploadMutation = useUploadCover();
  // const deleteMutation = useDeleteCover();

  const isCoverImageEmpty = !coverImage?.trim();
  const displayedCover = isCoverImageEmpty ? defaultCover : coverImage;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    e.target.value = '';

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기가 너무 커요! 10MB 이하 이미지만 업로드할 수 있어요.');
      return;
    }

    trackEvent(ADMIN_EVENT.CLUB_LOGO_UPLOAD_BUTTON_CLICKED);
    // TODO: uploadMutation.mutate({ clubId, file });
    console.log('Cover image upload:', file);
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

    trackEvent(ADMIN_EVENT.CLUB_LOGO_RESET_BUTTON_CLICKED);
    // TODO: deleteMutation.mutate(clubId);
    console.log('Cover image delete');
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
