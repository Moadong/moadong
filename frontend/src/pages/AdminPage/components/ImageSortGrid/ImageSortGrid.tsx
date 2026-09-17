import { useLayoutEffect, useState } from 'react';
import ClearButtonIcon from '@/assets/images/icons/dark_clear_button_icon.svg?react';
import * as Styled from './ImageSortGrid.styles';
import { ImageItem } from './types';
import { DropPosition } from './useDragSort';

interface ImageSortGridProps {
  items: ImageItem[];
  gridRef: React.RefObject<HTMLDivElement | null>;
  dragIndex: number | null;
  dropPosition: DropPosition;
  isLoading: boolean;
  columns?: number;
  onMouseDown: (e: React.MouseEvent, index: number) => void;
  onDelete: (index: number) => void;
  /** 항목별 업로드 재시도가 있는 화면(활동 사진)에서만 넘긴다 */
  onRetry?: (index: number) => void;
  /** 그리드 마지막 칸에 붙일 요소(홍보 화면의 이미지 추가 타일) */
  children?: React.ReactNode;
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

export const ImageSortGrid = ({
  items,
  gridRef,
  dragIndex,
  dropPosition,
  isLoading,
  columns = 3,
  onMouseDown,
  onDelete,
  onRetry,
  children,
}: ImageSortGridProps) => {
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
    <Styled.Grid ref={gridRef} $columns={columns}>
      {items.map((item, index) => {
        const src = item.type === 'uploaded' ? item.url : item.previewUrl;
        const status = item.type === 'local' ? item.status : undefined;

        return (
          <Styled.DragItem
            key={src}
            data-card-index={index}
            onMouseDown={(e) => onMouseDown(e, index)}
            $isDragging={dragIndex === index}
            $isDimmed={dragIndex !== null && dragIndex !== index}
          >
            <Styled.PhotoItem>
              <Styled.Photo
                src={src}
                alt=''
                draggable={false}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />

              {status === 'uploading' && (
                <Styled.Overlay>
                  <Styled.StatusText>업로드 중</Styled.StatusText>
                </Styled.Overlay>
              )}
              {status === 'failed' && (
                <Styled.Overlay $error>
                  <Styled.StatusText>실패</Styled.StatusText>
                  {onRetry && (
                    <Styled.RetryButton onClick={() => onRetry(index)}>
                      재전송
                    </Styled.RetryButton>
                  )}
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
          </Styled.DragItem>
        );
      })}

      {children}

      {divider && (
        <Styled.DropDivider
          $visible
          $x={divider.x}
          $top={divider.top}
          $height={divider.height}
        />
      )}
    </Styled.Grid>
  );
};
