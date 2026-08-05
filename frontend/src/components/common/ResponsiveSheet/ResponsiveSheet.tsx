import { ReactNode } from 'react';
import useDevice from '@/hooks/useDevice';
import BottomSheet from '../BottomSheet/BottomSheet';
import Modal from '../Modal/Modal';
import * as Styled from './ResponsiveSheet.styles';

interface ResponsiveSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 바텀시트로 열릴 때만 적용되는 배경색 */
  sheetBackground?: string;
  /** 위에 다른 시트를 겹쳐 띄울 때 뒤에서 보이도록 높이를 편다 (바텀시트 전용) */
  expanded?: boolean;
}

/**
 * 작은 화면에서는 하단 시트로, 큰 화면에서는 가운데 모달로 연다.
 * 같은 내용을 기기별로 다시 만들지 않기 위한 래퍼.
 */
const ResponsiveSheet = ({
  isOpen,
  onClose,
  children,
  sheetBackground,
  expanded,
}: ResponsiveSheetProps) => {
  const { isMobile, isTablet } = useDevice();

  if (isMobile || isTablet) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        background={sheetBackground}
        expanded={expanded}
      >
        {children}
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Styled.DesktopCard $background={sheetBackground}>
        {children}
      </Styled.DesktopCard>
    </Modal>
  );
};

export default ResponsiveSheet;
