import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  width: 100%;
`;

export const PhotoItem = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 123 / 160;
  overflow: hidden;
`;

export const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Overlay = styled.div<{ $error?: boolean }>`
  position: absolute;
  inset: 0;
  background: ${({ $error }) =>
    $error ? 'rgba(239, 68, 68, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StatusText = styled.span`
  ${setTypography(typography.button.button2)}
  color: ${colors.base.white};
`;

export const PendingBadge = styled.div`
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 100px;
  ${setTypography(typography.button.button2)}
  color: ${colors.base.white};
  white-space: nowrap;
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
