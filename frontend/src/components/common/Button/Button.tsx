import styled, { css, keyframes } from 'styled-components';

export interface ButtonProps {
  width?: string;
  children: React.ReactNode;
  type?: string;
  onClick?: () => void;
  animated?: boolean;
  disabled?: boolean;
  className?: string;
}

const pulse = keyframes`
  0% { transform: scale(1); background-color: #3a3a3a; }
  50% { transform: scale(1.05); background-color: #505050; }
  100% { transform: scale(1); background-color: #3a3a3a; }
`;

const StyledButton = styled.button<ButtonProps>`
  background-color: #3a3a3a;
  color: #ffffff;
  height: 42px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: ${({ width }) => width || 'auto'};

  &:hover:not(:disabled) {
    background-color: #333333;
    ${({ animated }) =>
      animated &&
      css`
        animation: ${pulse} 0.4s ease-in-out;
      `}
  }

  &:active {
    transform: ${({ animated }) => (animated ? 'scale(0.95)' : 'none')};
  }

  &:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Button = ({
  width,
  children,
  onClick,
  type,
  animated = false,
  disabled = false,
  className,
}: ButtonProps) => (
  <StyledButton
    width={width}
    onClick={onClick}
    animated={animated}
    type={type}
    disabled={disabled}
    className={className}
  >
    {children}
  </StyledButton>
);

export default Button;
