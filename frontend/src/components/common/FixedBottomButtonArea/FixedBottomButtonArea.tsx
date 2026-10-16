import type { ReactNode } from 'react';
import Button from '@/components/common/Button/Button';
import * as Styled from './FixedBottomButtonArea.styles';

interface FixedBottomButtonAreaProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}

const FixedBottomButtonArea = ({
  onClick,
  disabled,
  children,
}: FixedBottomButtonAreaProps) => (
  <Styled.ButtonArea>
    <Button onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  </Styled.ButtonArea>
);

export default FixedBottomButtonArea;
