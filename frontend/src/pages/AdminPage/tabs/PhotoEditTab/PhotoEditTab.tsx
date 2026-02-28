import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import { MAX_FILE_COUNT, MAX_FILE_SIZE } from '@/constants/uploadLimit';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useUpdateFeed, useUploadFeed } from '@/hooks/Queries/useClubImages';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import { ImagePreview } from '@/pages/AdminPage/tabs/PhotoEditTab/components/ImagePreview/ImagePreview';
import { ClubDetail } from '@/types/club';
import * as Styled from './PhotoEditTab.styles';

const PhotoEditTab = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.PHOTO_EDIT_PAGE);

  const clubDetail = useOutletContext<ClubDetail>();

  const { mutate: uploadFeed, isPending: isUploading } = useUploadFeed();
  const { mutate: updateFeed, isPending: isUpdating } = useUpdateFeed();

  const [imageList, setImageList] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = isUploading || isUpdating;

  useEffect(() => {
    if (!clubDetail) return;
    setImageList(clubDetail.feeds || []);
  }, [clubDetail]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    uploadFeed(
      {
        clubId: clubDetail.id,
        files: Array.from(files),
        existingUrls: imageList,
      },
      {
        onSuccess: (data) => {
          if (data.failedFiles.length > 0) {
            const failedFileNames = data.failedFiles.join(', ');
            alert(
              `일부 파일 업로드에 실패했어요.\n실패한 파일: ${failedFileNames}\n\n성공한 파일은 정상적으로 등록되었어요.`,
            );
          }
        },
        onError: () => {
          alert('이미지 업로드에 실패했어요. 다시 시도해주세요!');
        },
      },
    );
  };

  const handleUploadClick = () => {
    if (isLoading) return;

    trackEvent(ADMIN_EVENT.IMAGE_UPLOAD_BUTTON_CLICKED);

    if (imageList.length >= MAX_FILE_COUNT) {
      alert(`이미지는 최대 ${MAX_FILE_COUNT}장까지만 업로드할 수 있어요.`);
      return;
    }

    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const oversizedFile = Array.from(files).find(
      (file) => file.size > MAX_FILE_SIZE,
    );

    if (oversizedFile) {
      alert(
        `선택한 사진 중 ${oversizedFile.name}의 용량이 제한을 초과했습니다.`,
      );
      e.target.value = '';
      return;
    }

    handleFiles(files);
  };

  const deleteImage = (index: number) => {
    if (isLoading) return;

    const newList = imageList.filter((_, i) => i !== index);
    setImageList(newList);

    updateFeed(
      {
        clubId: clubDetail.id,
        urls: newList,
      },
      {
        onError: () => {
          alert('이미지 삭제에 실패했어요. 다시 시도해주세요!');
        },
      },
    );
  };

  return (
    <Styled.Container>
      <ContentSection>
        <ContentSection.Header title='활동 사진' />

        <ContentSection.Body>
          <Styled.Label>활동사진 추가 (최대 {MAX_FILE_COUNT}장)</Styled.Label>

          <div>
            <input
              ref={inputRef}
              type='file'
              accept='image/*'
              multiple
              hidden
              onChange={handleFileChange}
            />

            <Button
              width={'150px'}
              onClick={handleUploadClick}
              disabled={isLoading}
            >
              {isUploading ? '업로드 중...' : '이미지 업로드'}
            </Button>
          </div>

          <Styled.Label>활동사진 수정</Styled.Label>
          <Styled.ImageGrid>
            {imageList.map((image, index) => (
              <ImagePreview
                key={`${image}-${index}`}
                image={image}
                disabled={isLoading}
                onDelete={() => {
                  trackEvent(ADMIN_EVENT.IMAGE_DELETE_BUTTON_CLICKED);
                  deleteImage(index);
                }}
              />
            ))}
          </Styled.ImageGrid>
        </ContentSection.Body>
      </ContentSection>
    </Styled.Container>
  );
};

export default PhotoEditTab;
