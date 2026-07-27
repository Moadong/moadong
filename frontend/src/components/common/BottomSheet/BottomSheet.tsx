import { MouseEvent, ReactNode, useEffect, useRef } from 'react';
import Portal from '../Portal/Portal';
import * as Styled from './BottomSheet.styles';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  /** 시트 배경색 (기본 흰색) */
  background?: string;
}

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
  background,
}: BottomSheetProps) => {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Portal>
      <Styled.Overlay onClick={closeOnBackdrop ? onClose : undefined}>
        <Styled.Sheet
          role='dialog'
          aria-modal='true'
          $background={background}
          onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          <Styled.HandleBar />
          {children}
        </Styled.Sheet>
      </Styled.Overlay>
    </Portal>
  );
};

export default BottomSheet;
