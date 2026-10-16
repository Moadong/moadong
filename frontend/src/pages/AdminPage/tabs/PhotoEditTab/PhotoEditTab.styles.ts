import styled, { keyframes } from 'styled-components';
import { colors } from '@/styles/theme/colors';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const ButtonSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: ${colors.base.white};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  vertical-align: middle;
  margin-right: 6px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

export const GridHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const AddButton = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  border: 1.5px solid ${colors.gray[400]};
  background: transparent;
  font-size: 0.875rem;
  color: ${colors.gray[800]};
  cursor: pointer;

  &:hover {
    border-color: ${colors.gray[600]};
    background: ${colors.gray[50]};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const ClearAllButton = styled(AddButton)`
  color: #ef4444;
  border-color: #fca5a5;

  &:hover {
    border-color: #ef4444;
    background: #fff1f2;
  }
`;

export const GridWrapper = styled.div<{ $uploading?: boolean }>`
  position: relative;
  padding: 16px;
  min-height: 320px;
  border-radius: 16px;
  background: ${colors.gray[50]};
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${({ $uploading, theme }) =>
    $uploading
      ? `2px solid ${theme.colors.primary[900]}`
      : `2px dashed ${colors.gray[400]}`};
  transition: border-color 0.3s;
`;

export const UploadOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 20;
  pointer-events: none;
  backdrop-filter: blur(2px);

  span {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary[900]};
  }
`;

export const OverlaySpinner = styled.span`
  display: inline-block;
  width: 36px;
  height: 36px;
  border: 3px solid ${({ theme }) => theme.colors.primary[600]};
  border-top-color: ${({ theme }) => theme.colors.primary[900]};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const EmptyState = styled.button`
  width: 100%;
  min-height: 200px;
  border-radius: 12px;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${colors.gray[500]};
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    color: ${colors.gray[600]};
  }

  span:first-child {
    font-size: 2rem;
  }
`;
