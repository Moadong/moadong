import { useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import { MAX_FILE_COUNT } from '@/constants/uploadLimit';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import { ClubDetail } from '@/types/club';
import { FeedImageGrid } from './components/FeedImageGrid/FeedImageGrid';
import { useDragSort } from './hooks/useDragSort';
import { useFeedItems } from './hooks/useFeedItems';
import * as Styled from './PhotoEditTab.styles';

export interface UploadedItem { type: 'uploaded'; url: string }
export interface LocalItem {
  type: 'local';
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'failed';
}
export type FeedItem = UploadedItem | LocalItem;

const PhotoEditTab = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.PHOTO_EDIT_PAGE);

  const clubDetail = useOutletContext<ClubDetail>();

  const {
    feedItems,
    feedItemsRef,
    setFeedItems,
    isLoading,
    pendingChanges,
    addFiles,
    deleteImage,
    clearAll,
    retryItem,
    save,
  } = useFeedItems(clubDetail?.id, clubDetail?.feeds || []);

  const isFull = feedItems.length >= MAX_FILE_COUNT;
  const inputRef = useRef<HTMLInputElement>(null);

  const { gridRef, dragIndex, dropPosition, handleMouseDown } = useDragSort({
    disabled: isLoading,
    onReorder: setFeedItems,
    feedItemsRef,
  });

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

  const handleClearAll = () => {
    if (isLoading || !window.confirm('모든 사진을 삭제하시겠어요?')) return;
    clearAll();
  };

  return (
    <Styled.Container>
      <ContentSection>
        <ContentSection.Header
          title='활동 사진'
          action={
            <Button
              width={'150px'}
              animated
              onClick={save}
              disabled={isLoading || !pendingChanges}
            >
              {isLoading && <Styled.ButtonSpinner />}
              {isLoading ? '저장 중...' : '저장하기'}
            </Button>
          }
        />

        <ContentSection.Body>
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            multiple
            hidden
            onChange={handleFileChange}
          />

          {feedItems.length > 0 && (
            <Styled.GridHeader>
              <Styled.AddButton onClick={handleAddClick} disabled={isLoading || isFull}>
                + 이미지 추가
              </Styled.AddButton>
              <Styled.ClearAllButton onClick={handleClearAll} disabled={isLoading}>
                전체 삭제
              </Styled.ClearAllButton>
            </Styled.GridHeader>
          )}

          <Styled.GridWrapper $uploading={isLoading}>
            {isLoading && (
              <Styled.UploadOverlay>
                <Styled.OverlaySpinner />
                <span>사진을 업로드하고 있어요</span>
              </Styled.UploadOverlay>
            )}
            {feedItems.length === 0 ? (
              <Styled.EmptyState onClick={handleAddClick}>
                <span>+</span>
                <span>사진을 추가해보세요</span>
                <span>최대 {MAX_FILE_COUNT}장</span>
              </Styled.EmptyState>
            ) : (
              <FeedImageGrid
                feedItems={feedItems}
                gridRef={gridRef}
                dragIndex={dragIndex}
                dropPosition={dropPosition}
                isLoading={isLoading}
                onMouseDown={handleMouseDown}
                onDelete={(index) => {
                  trackEvent(ADMIN_EVENT.IMAGE_DELETE_BUTTON_CLICKED);
                  deleteImage(index);
                }}
                onRetry={retryItem}
              />
            )}
          </Styled.GridWrapper>
        </ContentSection.Body>
      </ContentSection>
    </Styled.Container>
  );
};

export default PhotoEditTab;
