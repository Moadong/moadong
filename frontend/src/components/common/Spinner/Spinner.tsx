import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SpinnerWrapperProps {
  height?: string;
}

interface SpinnerProps {
  height?: string;
}

const spin = keyframes`
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
`;

const SpinnerWrapper = styled.div.attrs<SpinnerWrapperProps>(() => ({
  role: 'status',
  'aria-label': '로딩 중',
}))<SpinnerWrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => height || '100vh'};
`;

const SpinnerCircle = styled.div`
  border: 6px solid #eee;
  border-top: 6px solid #ff5414;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: ${spin} 1s linear infinite;
`;

const Spinner = ({ height }: SpinnerProps) => (
  <SpinnerWrapper height={height}>
    <SpinnerCircle />
  </SpinnerWrapper>
);

export default Spinner;
