import type { ReactNode } from 'react';
import Button from '@/components/common/Button/Button';
import * as Styled from './MobileButtonArea.styles';

interface MobileButtonAreaProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}

const MobileButtonArea = ({
  onClick,
  disabled,
  children,
}: MobileButtonAreaProps) => (
  <Styled.ButtonArea>
    <Button onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  </Styled.ButtonArea>
);

export default MobileButtonArea;
