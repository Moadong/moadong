import { useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { ADMIN_EVENT } from '@/constants/eventName';
import { MAX_FILE_COUNT } from '@/constants/uploadLimit';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import MobileSaveButtonArea from '@/pages/AdminPage/components/MobileSaveButtonArea/MobileSaveButtonArea';
import { ClubDetail } from '@/types/club';
import { FeedImageGrid } from './components/FeedImageGrid/FeedImageGrid';
import PhotoUploadCard from './components/mobile/PhotoUploadCard/PhotoUploadCard';
import { useDragSort } from './hooks/useDragSort';
import { useFeedItems } from './hooks/useFeedItems';
import * as Styled from './PhotoEditTabMobile.styles';

const PhotoEditTabMobile = () => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  const clubDetail = useOutletContext<ClubDetail>();

  const {
    feedItems,
    feedItemsRef,
    setFeedItems,
    isLoading,
    pendingChanges,
    addFiles,
    deleteImage,
    retryItem,
    save,
  } = useFeedItems(clubDetail?.id, clubDetail?.feeds || []);

  const { gridRef, dragIndex, dropPosition, handleMouseDown } = useDragSort({
    disabled: isLoading,
    onReorder: setFeedItems,
    feedItemsRef,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const isFull = feedItems.length >= MAX_FILE_COUNT;
  const hasPhotos = feedItems.length > 0;

  const handleAddClick = () => {
    if (isLoading || isFull) return;
    trackEvent(ADMIN_EVENT.IMAGE_UPLOAD_BUTTON_CLICKED);
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    addFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleDelete = (index: number) => {
    trackEvent(ADMIN_EVENT.IMAGE_DELETE_BUTTON_CLICKED);
    deleteImage(index);
  };

  return (
    <>
      <Styled.MobileContainer>
        <WebviewTopBar
          title='활동 사진 수정'
          onBack={() => navigate('/admin')}
        />

        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          multiple
          hidden
          onChange={handleFileChange}
        />

        <Styled.PhotoSection>
          {!isFull && (
            <Styled.UploadSection>
              <Styled.SectionHeader>
                <Styled.SectionTitle>
                  활동 사진을 등록해보세요
                </Styled.SectionTitle>
                <Styled.SectionSubtitle>
                  지원자들이 동아리 분위기를 확인할 수 있어요
                </Styled.SectionSubtitle>
              </Styled.SectionHeader>

              <PhotoUploadCard
                count={feedItems.length}
                disabled={isLoading}
                onClick={handleAddClick}
              />
            </Styled.UploadSection>
          )}

          {hasPhotos && (
            <Styled.GridSection>
              <Styled.GridSectionTitle>
                활동사진 수정하기
              </Styled.GridSectionTitle>

              <FeedImageGrid
                feedItems={feedItems}
                gridRef={gridRef}
                dragIndex={dragIndex}
                dropPosition={dropPosition}
                isLoading={isLoading}
                columns={3}
                onMouseDown={handleMouseDown}
                onDelete={handleDelete}
                onRetry={retryItem}
              />
            </Styled.GridSection>
          )}
        </Styled.PhotoSection>
      </Styled.MobileContainer>

      <MobileSaveButtonArea
        onClick={save}
        disabled={isLoading || !pendingChanges}
      />
    </>
  );
};

export default PhotoEditTabMobile;
