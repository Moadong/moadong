import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FixedBottomButtonArea from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { ADMIN_EVENT } from '@/constants/eventName';
import { MAX_FILE_COUNT } from '@/constants/uploadLimit';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { ImageSortGrid } from '@/pages/AdminPage/components/ImageSortGrid/ImageSortGrid';
import { ImageItem } from '@/pages/AdminPage/components/ImageSortGrid/types';
import { useDragSort } from '@/pages/AdminPage/components/ImageSortGrid/useDragSort';
import PhotoUploadCard from './components/mobile/PhotoUploadCard/PhotoUploadCard';
import * as Styled from './PhotoEditTabMobile.styles';

interface PhotoEditTabMobileProps {
  feedItems: ImageItem[];
  feedItemsRef: React.MutableRefObject<ImageItem[]>;
  setFeedItems: React.Dispatch<React.SetStateAction<ImageItem[]>>;
  isLoading: boolean;
  pendingChanges: boolean;
  addFiles: (files: File[]) => void;
  deleteImage: (index: number) => void;
  retryItem: (index: number) => void;
  save: () => void;
}

const PhotoEditTabMobile = ({
  feedItems,
  feedItemsRef,
  setFeedItems,
  isLoading,
  pendingChanges,
  addFiles,
  deleteImage,
  retryItem,
  save,
}: PhotoEditTabMobileProps) => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const { gridRef, dragIndex, dropPosition, handleMouseDown } = useDragSort({
    disabled: isLoading,
    onReorder: setFeedItems,
    itemsRef: feedItemsRef,
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

              <ImageSortGrid
                items={feedItems}
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

      <FixedBottomButtonArea
        onClick={save}
        disabled={isLoading || !pendingChanges}
      >
        저장하기
      </FixedBottomButtonArea>
    </>
  );
};

export default PhotoEditTabMobile;
