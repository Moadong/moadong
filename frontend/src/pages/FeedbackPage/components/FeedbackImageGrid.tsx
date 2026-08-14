import RemoveIcon from '@/assets/images/icons/feedback/feedback_image_remove.svg?react';
import * as Styled from './FeedbackImageGrid.styles';

interface FeedbackImageGridProps {
  srcs: string[];
  /** 넘기지 않으면 읽기 전용이다. 보낸 편지는 이미 발송돼 삭제할 수 없다 */
  onRemove?: (index: number) => void;
}

const FeedbackImageGrid = ({ srcs, onRemove }: FeedbackImageGridProps) => {
  if (srcs.length === 0) return null;

  return (
    <Styled.Grid>
      {/* 같은 이미지를 두 번 첨부할 수 있어 URL만으로는 key가 고유하지 않다 */}
      {srcs.map((src, index) => (
        <Styled.Item key={`${index}-${src}`}>
          <Styled.Thumbnail src={src} alt={`첨부한 사진 ${index + 1}`} />
          {onRemove && (
            <Styled.RemoveButton
              type='button'
              aria-label={`첨부한 사진 ${index + 1} 삭제`}
              onClick={() => onRemove(index)}
            >
              <RemoveIcon width={8} height={8} aria-hidden />
            </Styled.RemoveButton>
          )}
        </Styled.Item>
      ))}
    </Styled.Grid>
  );
};

export default FeedbackImageGrid;
