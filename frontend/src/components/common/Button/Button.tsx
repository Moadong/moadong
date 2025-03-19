import React from 'react';
import styled, { keyframes, css } from 'styled-components';

export interface ButtonProps {
  width?: string;
  children: React.ReactNode;
  onClick: () => void;
  animated?: boolean;
}

const pulse = keyframes`
  0% { transform: scale(1); background-color: #3a3a3a; }
  50% { transform: scale(1.05); background-color: #505050; }
  100% { transform: scale(1); background-color: #3a3a3a; }
`;

const StyledButton = styled.button<ButtonProps>`
  background-color: #3a3a3a;
  color: #ffffff;
  height: 45px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: background-color 0.2s;
  width: ${({ width }) => width || 'auto'};

  &:hover {
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
`;


const Button = ({
  width,
  children,
  onClick,
  animated = false,
}: ButtonProps) => (
  <StyledButton width={width} onClick={onClick} animated={animated}>
    {children}
  </StyledButton>
);

export default Button;
