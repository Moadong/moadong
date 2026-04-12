import styled, { css, keyframes } from 'styled-components';
import { colors } from '../../../styles/theme/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  animated?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const pulse = keyframes`
  0% { transform: scale(1); background-color: ${colors.gray[900]}; }
  50% { transform: scale(1.05); background-color: ${colors.gray[800]}; }
  100% { transform: scale(1); background-color: ${colors.gray[900]}; }
`;

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${colors.primary[900]};
        color: ${colors.base.white};
        &:hover {
          background-color: ${colors.primary[800]};
        }
        &:active {
          transform: scale(0.98);
        }
        &:disabled {
          background-color: ${colors.gray[500]};
          color: ${colors.gray[100]};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${colors.gray[200]};
        color: ${colors.gray[900]};
        &:hover {
          background-color: ${colors.gray[300]};
        }
        &:active {
          transform: scale(0.98);
        }
        &:disabled {
          background-color: ${colors.gray[500]};
          color: ${colors.gray[100]};
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${colors.gray[800]};
        border: 1px solid ${colors.gray[400]};
        &:hover {
          background-color: ${colors.gray[100]};
        }
        &:active {
          transform: scale(0.98);
        }
        &:disabled {
          color: ${colors.gray[500]};
          border-color: ${colors.gray[300]};
          background-color: transparent;
        }
      `;
    case 'danger':
      return css`
        background-color: #dc3545; // 임시 색상, 필요 시 theme에 추가
        color: ${colors.base.white};
        &:hover {
          background-color: #c82333;
        }
        &:active {
          transform: scale(0.98);
        }
        &:disabled {
          background-color: ${colors.gray[500]};
          color: ${colors.gray[100]};
        }
      `;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return css`
        height: 32px;
        padding: 0 12px;
        font-size: 14px;
      `;
    case 'medium':
      return css`
        height: 42px;
        padding: 0 16px;
        font-size: 16px;
      `;
    case 'large':
      return css`
        height: 52px;
        padding: 0 20px;
        font-size: 18px;
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: ${({ width }) => width || 'auto'};

  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'medium' }) => getSizeStyles(size)}

  &:hover {
    ${({ animated, variant }) =>
      animated &&
      (variant === 'primary' || variant === 'secondary') &&
      css`
        animation: ${pulse} 0.4s ease-in-out;
      `}
  }

  &:active {
    ${({ animated }) =>
      animated &&
      css`
        transform: scale(0.95);
      `}
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    /* disabled 스타일은 getVariantStyles 내부에서 처리됨 */
  }
`;

const Button = ({
  width,
  children,
  onClick,
  type = 'button',
  animated = false,
  disabled = false,
  className,
  variant = 'primary',
  size = 'medium',
}: ButtonProps) => (
  <StyledButton
    width={width}
    onClick={onClick}
    animated={animated}
    type={type}
    disabled={disabled}
    className={className}
    variant={variant}
    size={size}
  >
    {children}
  </StyledButton>
);

export default Button;
