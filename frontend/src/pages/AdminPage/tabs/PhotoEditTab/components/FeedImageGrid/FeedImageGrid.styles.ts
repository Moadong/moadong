import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Grid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: 2px;
  width: 100%;
  align-self: flex-start;
  position: relative;
`;

export const DragItem = styled.div<{
  $isDragging?: boolean;
  $isDimmed?: boolean;
}>`
  opacity: ${({ $isDragging, $isDimmed }) =>
    $isDragging ? 1 : $isDimmed ? 0.35 : 1};
  filter: ${({ $isDimmed }) => ($isDimmed ? 'blur(1.5px)' : 'none')};
  cursor: grab;
  transition:
    opacity 0.2s,
    filter 0.2s;

  &:active {
    cursor: grabbing;
  }
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${({ $error }) =>
    $error ? 'rgba(239, 68, 68, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
`;

export const StatusText = styled.span`
  ${setTypography(typography.button.button2)}
  color: ${colors.base.white};
`;

export const RetryButton = styled.button`
  padding: 4px 12px;
  border: 1.5px solid ${colors.base.white};
  border-radius: 6px;
  background: transparent;
  ${setTypography(typography.button.button2)}
  color: ${colors.base.white};
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
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

export const DropDivider = styled.div<{
  $x: number;
  $top: number;
  $height: number;
  $visible: boolean;
}>`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $top }) => $top}px;
  height: ${({ $height }) => $height}px;
  width: 3px;
  transform: translateX(-50%);
  border-radius: 2px;
  background-color: ${({ $visible, theme }) =>
    $visible ? theme.colors.primary[900] : 'transparent'};
  transition: background-color 0.1s;
  pointer-events: none;
  z-index: 10;
`;
