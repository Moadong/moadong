import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
`;

export const ImagePreviewContainer = styled.div`
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  position: relative;
  user-select: none;
  background-color: ${({ theme }) => theme.colors.gray[100]};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  border: none;
  cursor: pointer;
  background-color: transparent;

  img {
    width: 28px;
    height: 28px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Overlay = styled.div<{ $error?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${({ $error }) =>
    $error ? 'rgba(220, 38, 38, 0.6)' : 'rgba(0, 0, 0, 0.4)'};
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.3);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40%;
    height: 100%;
    background-color: white;
    animation: ${shimmer} 1.2s ease-in-out infinite;
  }
`;

export const PendingBadge = styled.div`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
`;

export const RetryButton = styled.button`
  padding: 4px 12px;
  border: 1.5px solid white;
  border-radius: 6px;
  background: transparent;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;
