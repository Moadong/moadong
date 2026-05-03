import type { ButtonHTMLAttributes } from 'react';
import styled, { css, keyframes } from 'styled-components';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  animated?: boolean;
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StyledButton = styled.button<{ $animated: boolean; $width?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.base.white};
  height: 42px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  font-size: ${({ theme }) => theme.typography.paragraph.p2.size};
  font-weight: ${({ theme }) => theme.typography.paragraph.p2.weight};
  cursor: pointer;
  transition: background-color 0.2s;
  width: ${({ $width }) => $width ?? 'auto'};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
    ${({ $animated }) =>
      $animated &&
      css`
        animation: ${pulse} 0.4s ease-in-out;
      `}
  }

  &:active:not(:disabled) {
    transform: ${({ $animated }) => ($animated ? 'scale(0.95)' : 'none')};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[500]};
    color: ${({ theme }) => theme.colors.gray[600]};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Button = ({
  width,
  animated = false,
  type = 'button',
  children,
  ...rest
}: ButtonProps) => (
  <StyledButton $animated={animated} $width={width} type={type} {...rest}>
    {children}
  </StyledButton>
);

export default Button;
