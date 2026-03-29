import { useLayoutEffect, useState } from 'react';
import { ImagePreview } from '@/pages/AdminPage/tabs/PhotoEditTab/components/ImagePreview/ImagePreview';
import { DropPosition } from '../../hooks/useDragSort';
import { FeedItem } from '../../PhotoEditTab';
import * as Styled from '../../PhotoEditTab.styles';

interface FeedImageGridProps {
  feedItems: FeedItem[];
  gridRef: React.RefObject<HTMLDivElement | null>;
  dragIndex: number | null;
  dropPosition: DropPosition;
  isLoading: boolean;
  onMouseDown: (e: React.MouseEvent, index: number) => void;
  onDelete: (index: number) => void;
  onRetry: (index: number) => void;
}

const calcDividerStyle = (
  grid: HTMLDivElement,
  cards: HTMLElement[],
  idx: number,
) => {
  const gridRect = grid.getBoundingClientRect();
  const ref = cards[Math.min(idx, cards.length - 1)];
  const refRect = ref.getBoundingClientRect();

  let x: number;
  if (idx === 0) {
    x = refRect.left - gridRect.left;
  } else if (idx === cards.length) {
    x = refRect.right - gridRect.left;
  } else {
    const prevRect = cards[idx - 1].getBoundingClientRect();
    const sameRow = Math.abs(prevRect.top - refRect.top) < refRect.height / 2;
    x = sameRow
      ? (prevRect.right + refRect.left) / 2 - gridRect.left
      : refRect.left - gridRect.left;
  }

  return { x, top: refRect.top - gridRect.top, height: refRect.height };
};

export const FeedImageGrid = ({
  feedItems,
  gridRef,
  dragIndex,
  dropPosition,
  isLoading,
  onMouseDown,
  onDelete,
  onRetry,
}: FeedImageGridProps) => {
  const dividerIndex = dropPosition
    ? dropPosition.side === 'before'
      ? dropPosition.index
      : dropPosition.index + 1
    : null;

  const [divider, setDivider] = useState<{
    x: number;
    top: number;
    height: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (dividerIndex === null || !gridRef.current) {
      setDivider(null);
      return;
    }
    const cards = Array.from(
      gridRef.current.querySelectorAll<HTMLElement>('[data-card-index]'),
    );
    if (cards.length === 0) return;
    setDivider(calcDividerStyle(gridRef.current, cards, dividerIndex));
  }, [dividerIndex]);

  return (
    <Styled.ImageGrid ref={gridRef}>
      {feedItems.map((item, index) => (
        <Styled.DragItem
          key={item.type === 'uploaded' ? item.url : item.previewUrl}
          data-card-index={index}
          onMouseDown={(e) => onMouseDown(e, index)}
          $isDragging={dragIndex === index}
          $isDimmed={dragIndex !== null && dragIndex !== index}
        >
          <ImagePreview
            image={item.type === 'uploaded' ? item.url : item.previewUrl}
            status={item.type === 'local' ? item.status : undefined}
            disabled={isLoading}
            onDelete={() => onDelete(index)}
            onRetry={
              item.type === 'local' && item.status === 'failed'
                ? () => onRetry(index)
                : undefined
            }
          />
        </Styled.DragItem>
      ))}

      {divider && (
        <Styled.DropDivider
          $visible
          $x={divider.x}
          $top={divider.top}
          $height={divider.height}
        />
      )}
    </Styled.ImageGrid>
  );
};
