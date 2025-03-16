import React from 'react';
import styled, { keyframes } from 'styled-components';
import Button from './Button';
import { ButtonProps } from './Button';

const pulse = keyframes`
  0% { transform: scale(1); background-color: #3a3a3a; }
  50% { transform: scale(1.05); background-color: #505050; }
  100% { transform: scale(1); background-color: #3a3a3a; }
`;

const AnimatedStyleButton = styled(Button)`
  &:hover {
    animation: ${pulse} 0.4s ease-in-out;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AnimatedButton = ({ width, children, onClick }: ButtonProps) => (
  <AnimatedStyleButton width={width} onClick={onClick}>
    {children}
  </AnimatedStyleButton>
);

export default AnimatedButton;
