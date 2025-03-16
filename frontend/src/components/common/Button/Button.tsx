import React from 'react';
import styled from 'styled-components';

export interface ButtonProps {
  width?: string;
  children: React.ReactNode;
  onClick: () => void;
}

const StyledButton = styled.button<ButtonProps>`
  background-color: #3a3a3a;
  color: #ffffff;
  height: 45px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
  width: ${({ width }) => width || 'auto'};

  &:hover {
    background-color: #333333;
  }
`;

const Button = ({ width, children, onClick }: ButtonProps) => (
  <StyledButton width={width} onClick={onClick}>
    {children}
  </StyledButton>
);

export default Button;
