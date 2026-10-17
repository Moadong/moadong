import RemoveIcon from '@/assets/images/icons/feedback/feedback_image_remove.svg?react';
import type { ItemStatus } from '@/types/imageItem';
import * as Styled from './FeedbackImageGrid.styles';

interface FeedbackImageGridProps {
  srcs: string[];
  /** srcs와 같은 순서의 업로드 상태. 이미 올라간 사진은 undefined다 */
  statuses?: (ItemStatus | undefined)[];
  /** 넘기지 않으면 읽기 전용이다. 보낸 편지는 이미 발송돼 삭제할 수 없다 */
  onRemove?: (index: number) => void;
  onRetry?: (index: number) => void;
  /** 업로드·전송 중에는 삭제와 재전송을 막는다 */
  disabled?: boolean;
}

const FeedbackImageGrid = ({
  srcs,
  statuses,
  onRemove,
  onRetry,
  disabled = false,
}: FeedbackImageGridProps) => {
  if (srcs.length === 0) return null;

  return (
    <Styled.Grid>
      {/* 같은 이미지를 두 번 첨부할 수 있어 URL만으로는 key가 고유하지 않다 */}
      {srcs.map((src, index) => {
        const status = statuses?.[index];

        return (
          <Styled.Item key={`${index}-${src}`}>
            <Styled.Thumbnail src={src} alt={`첨부한 사진 ${index + 1}`} />
            {status === 'uploading' && (
              <Styled.Overlay>
                <Styled.StatusText>업로드 중</Styled.StatusText>
              </Styled.Overlay>
            )}
            {status === 'failed' && (
              <Styled.Overlay $error>
                <Styled.StatusText>실패</Styled.StatusText>
                {onRetry && (
                  <Styled.RetryButton
                    type='button'
                    aria-label={`첨부한 사진 ${index + 1} 재전송`}
                    onClick={() => onRetry(index)}
                    disabled={disabled}
                  >
                    재전송
                  </Styled.RetryButton>
                )}
              </Styled.Overlay>
            )}
            {/* 오버레이보다 뒤에 그려야 실패한 사진도 지울 수 있다 */}
            {onRemove && (
              <Styled.RemoveButton
                type='button'
                aria-label={`첨부한 사진 ${index + 1} 삭제`}
                onClick={() => onRemove(index)}
                disabled={disabled}
              >
                <RemoveIcon width={8} height={8} aria-hidden />
              </Styled.RemoveButton>
            )}
          </Styled.Item>
        );
      })}
    </Styled.Grid>
  );
};

export default FeedbackImageGrid;
