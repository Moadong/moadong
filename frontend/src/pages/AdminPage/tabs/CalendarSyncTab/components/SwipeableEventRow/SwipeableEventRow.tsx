import { PointerEvent, ReactNode, useRef, useState } from 'react';
import TrashIcon from '@/assets/images/icons/Delete_applicant.svg?react';
import * as Styled from './SwipeableEventRow.styles';
import { DELETE_WIDTH } from './SwipeableEventRow.styles';

/** 이 거리 이상 왼쪽으로 끌면 삭제 버튼이 열린다 */
const OPEN_THRESHOLD = 30;

interface SwipeableEventRowProps {
  children: ReactNode;
  onDelete: () => void;
  deleteLabel?: string;
  /** 열림 여부는 부모가 관리해 한 번에 하나만 열리게 한다 */
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * 오른쪽 → 왼쪽 스와이프로 삭제 아이콘을 노출하는 행.
 * 포인터 이벤트를 사용해 마우스/터치 모두 지원한다.
 */
const SwipeableEventRow = ({
  children,
  onDelete,
  deleteLabel = '일정 삭제',
  isOpen,
  onOpenChange,
}: SwipeableEventRowProps) => {
  /** 드래그 중에만 값을 갖는다. 놓으면 null이 되어 부모의 isOpen을 따른다. */
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const startXRef = useRef(0);
  const baseOffsetRef = useRef(0);

  const isDragging = dragOffset !== null;
  const offset = dragOffset ?? (isOpen ? DELETE_WIDTH : 0);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    startXRef.current = event.clientX;
    baseOffsetRef.current = offset;
    setDragOffset(offset);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const delta = startXRef.current - event.clientX;
    const next = Math.min(
      DELETE_WIDTH,
      Math.max(0, baseOffsetRef.current + delta),
    );
    setDragOffset(next);
  };

  const handlePointerUp = () => {
    if (dragOffset === null) return;
    const shouldOpen = dragOffset >= OPEN_THRESHOLD;
    setDragOffset(null);
    onOpenChange(shouldOpen);
  };

  return (
    <Styled.Container>
      <Styled.DeleteAction
        type='button'
        aria-label={deleteLabel}
        onClick={onDelete}
      >
        <TrashIcon />
      </Styled.DeleteAction>
      <Styled.Content
        $offset={offset}
        $animate={!isDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {children}
      </Styled.Content>
    </Styled.Container>
  );
};

export default SwipeableEventRow;
