import { ReactNode, useEffect, useRef, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { colors } from '@/styles/theme/colors';

const LONG_PRESS_MS = 200;
// 브라우저가 스크롤로 판정하기 전(터치 슬롭 약 15px)에 취소되도록 그보다 작게 둔다
const MOVE_TOLERANCE_PX = 8;
// 버튼·드롭다운 위에서 누르면 클릭이 우선이므로 드래그를 시작하지 않는다.
// 질문 제목·설명 입력은 카드 대부분을 차지해서 제외하면 길게 누를 곳이 여백뿐이다.
// 입력 위에서는 짧게 누르면 편집, 길게 누르면 드래그로 나눈다.
const CLICK_TARGET_SELECTOR = [
  'select:not(:disabled)',
  'button:not(:disabled)',
  'a[href]',
  '[role="button"]',
  '[role="listbox"]',
  '[role="option"]',
].join(', ');

interface LongPressReorderItemProps<T> {
  value: T;
  children: ReactNode;
}

/**
 * Reorder.Group 안에서 길게 누른 뒤에만 드래그가 시작되는 항목.
 * 바로 드래그되면 카드 안 입력·스크롤과 겹치기 때문에 길게 누르기로 의도를 구분한다.
 */
const LongPressReorderItem = <T,>({
  value,
  children,
}: LongPressReorderItemProps<T>) => {
  const dragControls = useDragControls();
  const itemRef = useRef<HTMLDivElement>(null);
  // 누르고 있는 동안의 타이머·리스너 정리 함수. 누르고 있지 않으면 null
  const pendingPressCleanupRef = useRef<(() => void) | null>(null);
  // 터치 리스너가 렌더를 기다리지 않고 바로 읽어야 해서 상태와 따로 둔다
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const updateDragging = (next: boolean) => {
    isDraggingRef.current = next;
    setIsDragging(next);
  };

  const cancelPress = () => pendingPressCleanupRef.current?.();

  useEffect(() => cancelPress, []);

  // 터치 드래그 중 브라우저가 스크롤을 시작하면 pointercancel로 드래그가 끊긴다.
  // 모바일 브라우저는 터치를 시작한 순간 그 자리에 스크롤을 막는 리스너가 있는지로
  // touchmove를 막을 수 있는지 정하므로, 드래그 시작 시점이 아니라 처음부터 항목에 붙여 둔다.
  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;
    const preventScrollWhileDragging = (e: TouchEvent) => {
      if (isDraggingRef.current) e.preventDefault();
    };
    item.addEventListener('touchmove', preventScrollWhileDragging, {
      passive: false,
    });
    return () =>
      item.removeEventListener('touchmove', preventScrollWhileDragging);
  }, []);

  // 길게 누른 뒤 움직이지 않고 떼면 framer-motion이 onDragEnd를 부르지 않는다.
  // 여기서도 끝내지 않으면 드래그 상태가 남는다.
  useEffect(() => {
    if (!isDragging) return;
    const endDrag = () => updateDragging(false);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    return () => {
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as Element).closest(CLICK_TARGET_SELECTOR)) return;
    cancelPress();

    const pointerEvent = e.nativeEvent;
    const { clientX: startX, clientY: startY } = e;

    // 포인터가 카드 밖(카드 사이 간격·다른 카드)으로 나가도 움직임·뗌을 놓치지 않도록 window에서 듣는다
    const handleMove = (moveEvent: PointerEvent) => {
      const distance = Math.hypot(
        moveEvent.clientX - startX,
        moveEvent.clientY - startY,
      );
      if (distance > MOVE_TOLERANCE_PX) cleanup();
    };
    const timer = window.setTimeout(() => {
      cleanup();
      // 드래그를 시작할 때 포커스·선택을 풀어 키보드·텍스트 선택이 드래그와 겹치지 않게 한다
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      window.getSelection()?.removeAllRanges();
      updateDragging(true);
      dragControls.start(pointerEvent);
    }, LONG_PRESS_MS);
    const cleanup = () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', cleanup);
      window.removeEventListener('pointercancel', cleanup);
      pendingPressCleanupRef.current = null;
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', cleanup);
    window.addEventListener('pointercancel', cleanup);
    pendingPressCleanupRef.current = cleanup;
  };

  return (
    <Reorder.Item
      ref={itemRef}
      as='div'
      value={value}
      dragListener={false}
      dragControls={dragControls}
      onPointerDown={handlePointerDown}
      onDragEnd={() => updateDragging(false)}
      whileDrag={{
        scale: 1.02,
        boxShadow: `0 8px 24px ${colors.base.black}1F`,
      }}
      style={{
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: isDragging ? 'none' : undefined,
      }}
    >
      {/* 드래그 중엔 안쪽 입력이 포인터를 받지 않게 해 커서가 grabbing에서 텍스트 커서로 바뀌지 않게 한다 */}
      <div style={{ pointerEvents: isDragging ? 'none' : undefined }}>
        {children}
      </div>
    </Reorder.Item>
  );
};

export default LongPressReorderItem;
