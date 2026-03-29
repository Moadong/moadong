import clearButton from '@/assets/images/icons/input_clear_button_icon.svg';
import * as Styled from './ImagePreview.styles';

type ItemStatus = 'pending' | 'uploading' | 'failed';

interface ImagePreviewProps {
  image: string;
  onDelete: () => void;
  disabled?: boolean;
  status?: ItemStatus;
  onRetry?: () => void;
}

export const ImagePreview = ({
  image,
  onDelete,
  disabled = false,
  status,
  onRetry,
}: ImagePreviewProps) => {
  return (
    <Styled.ImagePreviewContainer>
      <img src={image} alt='preview' draggable={false} />

      {status === 'pending' && <Styled.PendingBadge>업로드 예정</Styled.PendingBadge>}

      {status === 'failed' && (
        <Styled.Overlay $error>
          <span>실패</span>
          {onRetry && (
            <Styled.RetryButton onClick={onRetry}>재전송</Styled.RetryButton>
          )}
        </Styled.Overlay>
      )}

      <Styled.ClearButton
        onClick={onDelete}
        disabled={disabled || status === 'uploading'}
      >
        <img src={clearButton} alt='삭제' draggable={false} />
      </Styled.ClearButton>
    </Styled.ImagePreviewContainer>
  );
};
