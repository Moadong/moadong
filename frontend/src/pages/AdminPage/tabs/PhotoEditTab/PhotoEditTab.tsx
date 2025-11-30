import { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as Styled from './PhotoEditTab.styles';
import { ImagePreview } from '@/pages/AdminPage/tabs/PhotoEditTab/components/ImagePreview/ImagePreview';
import { ClubDetail } from '@/types/club';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/useTrackPageView';
import {
  useUploadFeed,
  useUpdateFeed,
} from '@/hooks/queries/club/images/useFeedMutation';
import Button from '@/components/common/Button/Button';
import { MAX_FILE_SIZE } from '@/constants/uploadLimit';

const PhotoEditTab = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.PHOTO_EDIT_PAGE);

  const clubDetail = useOutletContext<ClubDetail>();
  const { mutate: updateFeed, isPending: isUpdating } = useUpdateFeed();
  const { mutate: uploadFeed, isPending: isUploading } = useUploadFeed();
  const [imageList, setImageList] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = isUploading || isUpdating;

  // 초기 이미지 목록 세팅
  useEffect(() => {
    if (!clubDetail) return;
    setImageList(clubDetail.feeds || []);
  }, [clubDetail]);

  // 파일 업로드 처리
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    uploadFeed({
      clubId: clubDetail.id,
      files: fileArray,
      existingUrls: imageList,
    });
  };

  // 이미지 업로드 버튼 클릭
  const handleUploadClick = () => {
    if (isLoading) return;
    trackEvent(ADMIN_EVENT.IMAGE_UPLOAD_BUTTON_CLICKED);
    if (imageList.length >= 5) {
      alert('이미지는 최대 5장까지만 업로드할 수 있어요.');
      return;
    }
    inputRef.current?.click();
  };

  // 이미지 삭제
  const deleteImage = (index: number) => {
    if (isLoading) return;
    const newList = imageList.filter((_, i) => i !== index);
    setImageList(newList);
    updateFeed({ clubId: clubDetail.id, urls: newList });
  };

  return (
    <Styled.PhotoEditorContainer>
      <Styled.InfoTitle>활동 사진 편집</Styled.InfoTitle>

      <Styled.Label>활동사진 추가 (최대 5장)</Styled.Label>
      <Styled.ImageContainer>
        <div>
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            multiple={true}
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > MAX_FILE_SIZE) {
                alert('선택한 사진 용량이 10MB를 초과합니다.');
                return;
              }
              handleFiles(e.target.files);
            }}
          />
          <Button width='30%' onClick={handleUploadClick} disabled={isLoading}>
            {isUploading ? '업로드 중...' : '이미지 업로드'}
          </Button>
        </div>

        <br />
        <Styled.Label>활동사진 수정</Styled.Label>
        <Styled.ImageGrid>
          {imageList.map((image, index) => (
            <ImagePreview
              key={`${image}-${index}`}
              image={image}
              onDelete={() => {
                trackEvent(ADMIN_EVENT.IMAGE_DELETE_BUTTON_CLICKED);
                deleteImage(index);
              }}
              disabled={isLoading}
            />
          ))}
        </Styled.ImageGrid>
      </Styled.ImageContainer>
    </Styled.PhotoEditorContainer>
  );
};

export default PhotoEditTab;
