import { ReactNode, useEffect, useRef, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';

const LONG_PRESS_MS = 400;
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
  disabled?: boolean;
  children: ReactNode;
}

/**
 * Reorder.Group 안에서 길게 누른 뒤에만 드래그가 시작되는 항목.
 * 바로 드래그되면 카드 안 입력·스크롤과 겹치기 때문에 길게 누르기로 의도를 구분한다.
 */
const LongPressReorderItem = <T,>({
  value,
  disabled = false,
  children,
}: LongPressReorderItemProps<T>) => {
  const dragControls = useDragControls();
  // 누르고 있는 동안의 타이머·리스너 정리 함수. 누르고 있지 않으면 null
  const pendingPressCleanupRef = useRef<(() => void) | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const cancelPress = () => pendingPressCleanupRef.current?.();

  useEffect(() => cancelPress, []);

  // 터치 드래그 중 브라우저가 스크롤을 시작하면 pointercancel로 드래그가 끊긴다
  useEffect(() => {
    if (!isDragging) return;
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    // 길게 누른 뒤 움직이지 않고 떼면 framer-motion이 onDragEnd를 부르지 않는다.
    // 여기서도 끝내지 않으면 스크롤 차단이 남아 페이지가 굳는다.
    const endDrag = () => setIsDragging(false);
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    return () => {
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    if ((e.target as Element).closest(CLICK_TARGET_SELECTOR)) return;
    cancelPress();

    const pointerEvent = e.nativeEvent;
    const item = e.currentTarget;
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
      // 입력 위에서 시작했으면 포커스·선택을 풀어 키보드·텍스트 선택이 드래그와 겹치지 않게 한다
      if (item.contains(document.activeElement)) {
        (document.activeElement as HTMLElement).blur();
      }
      window.getSelection()?.removeAllRanges();
      setIsDragging(true);
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
      as='div'
      value={value}
      dragListener={false}
      dragControls={dragControls}
      onPointerDown={handlePointerDown}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{
        scale: 1.02,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      }}
      style={{
        position: 'relative',
        zIndex: isDragging ? 1 : 0,
        userSelect: isDragging ? 'none' : undefined,
      }}
    >
      {children}
    </Reorder.Item>
  );
};

export default LongPressReorderItem;
