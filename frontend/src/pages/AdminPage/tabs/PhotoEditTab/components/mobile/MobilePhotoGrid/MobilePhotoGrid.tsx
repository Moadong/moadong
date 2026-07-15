import ClearButtonIcon from '@/assets/images/icons/dark_clear_button_icon.svg?react';
import { FeedItem } from '../../../types';
import * as Styled from './MobilePhotoGrid.styles';

interface MobilePhotoGridProps {
  feedItems: FeedItem[];
  isLoading: boolean;
  onDelete: (index: number) => void;
}

export const MobilePhotoGrid = ({
  feedItems,
  isLoading,
  onDelete,
}: MobilePhotoGridProps) => (
  <Styled.Grid>
    {feedItems.map((item, index) => {
      const src = item.type === 'uploaded' ? item.url : item.previewUrl;
      const status = item.type === 'local' ? item.status : undefined;

      return (
        <Styled.PhotoItem key={src}>
          <Styled.Photo src={src} alt='' draggable={false} />

          {status === 'uploading' && (
            <Styled.Overlay>
              <Styled.StatusText>업로드 중</Styled.StatusText>
            </Styled.Overlay>
          )}
          {status === 'failed' && (
            <Styled.Overlay $error>
              <Styled.StatusText>실패</Styled.StatusText>
            </Styled.Overlay>
          )}
          {status === 'pending' && (
            <Styled.PendingBadge>업로드 예정</Styled.PendingBadge>
          )}

          <Styled.DeleteButton
            type='button'
            onClick={() => onDelete(index)}
            disabled={isLoading || status === 'uploading'}
            aria-label='사진 삭제'
          >
            <ClearButtonIcon />
          </Styled.DeleteButton>
        </Styled.PhotoItem>
      );
    })}
  </Styled.Grid>
);
