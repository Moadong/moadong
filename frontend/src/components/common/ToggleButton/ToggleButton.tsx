import type { ButtonHTMLAttributes } from 'react';
import * as Styled from './ToggleButton.styles';

interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
}

const ToggleButton = ({
  active,
  children,
  type = 'button',
  ...rest
}: ToggleButtonProps) => (
  <Styled.Button $active={active} type={type} {...rest}>
    {children}
  </Styled.Button>
);

export default ToggleButton;
