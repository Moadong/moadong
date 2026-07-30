import { MouseEvent, ReactNode } from 'react';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import useTopmostEscape from '@/hooks/useTopmostEscape';
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
  useBodyScrollLock(isOpen);
  useTopmostEscape(isOpen, onClose);

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
