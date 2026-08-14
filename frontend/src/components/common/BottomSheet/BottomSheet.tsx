import { MouseEvent, PointerEvent, ReactNode, useRef, useState } from 'react';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import useTopmostEscape from '@/hooks/useTopmostEscape';
import Portal from '../Portal/Portal';
import * as Styled from './BottomSheet.styles';

/** 이 거리 이상 아래로 끌면 시트를 닫는다 */
const CLOSE_THRESHOLD = 100;

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  /** 시트 배경색 (기본 흰색) */
  background?: string;
  /** 위에 다른 시트를 겹쳐 띄울 때, 뒤에서 보이도록 시트를 들어올린다 */
  stacked?: boolean;
}

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
  background,
  stacked,
}: BottomSheetProps) => {
  useBodyScrollLock(isOpen);
  useTopmostEscape(isOpen, onClose);

  /** 드래그 중에만 값을 갖는다. 놓으면 null이 되어 제자리로 돌아간다. */
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const startYRef = useRef(0);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // 캡처하지 않으면 빠르게 끌 때 포인터가 손잡이를 벗어나 드래그가 끊긴다
    event.currentTarget.setPointerCapture(event.pointerId);
    startYRef.current = event.clientY;
    setDragOffset(0);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragOffset === null) return;
    // 위로는 끌리지 않게 아래 방향만 반영한다
    setDragOffset(Math.max(0, event.clientY - startYRef.current));
  };

  const handlePointerUp = () => {
    if (dragOffset === null) return;
    const shouldClose = dragOffset >= CLOSE_THRESHOLD;
    setDragOffset(null);
    if (shouldClose) onClose();
  };

  /** 취소된 제스처는 놓은 것이 아니므로 닫지 않고 제자리로 돌린다 */
  const handlePointerCancel = () => setDragOffset(null);

  if (!isOpen) return null;

  return (
    <Portal>
      <Styled.Overlay onClick={closeOnBackdrop ? onClose : undefined}>
        <Styled.Sheet
          role='dialog'
          aria-modal='true'
          $background={background}
          $dragOffset={dragOffset ?? 0}
          $animateBack={dragOffset === null}
          $stacked={stacked}
          onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          <Styled.DragHandle
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            <Styled.HandleBar />
          </Styled.DragHandle>
          {children}
        </Styled.Sheet>
      </Styled.Overlay>
    </Portal>
  );
};

export default BottomSheet;
