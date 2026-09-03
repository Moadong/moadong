import { useEffect, useRef } from 'react';

/**
 * ESC로 가장 위에 열린 오버레이 하나만 닫는다.
 *
 * 모달 안에서 시트를 여는 것처럼 오버레이가 겹칠 때 각자 document에 리스너를
 * 달면 ESC 한 번에 둘 다 닫힌다. 열린 순서를 쌓아두고 맨 위에만 전달한다.
 */
const stack: Array<() => void> = [];

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return;
  /** 한글 조합 중 ESC는 IME가 조합을 정리하는 키라 오버레이까지 닫지 않는다 */
  if (event.isComposing) return;
  stack[stack.length - 1]?.();
};

const useTopmostEscape = (isOpen: boolean, onClose: () => void) => {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const close = () => onCloseRef.current();
    if (stack.length === 0) {
      document.addEventListener('keydown', handleKeyDown);
    }
    stack.push(close);

    return () => {
      stack.splice(stack.indexOf(close), 1);
      if (stack.length === 0) {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isOpen]);
};

export default useTopmostEscape;
