// FeedImageGrid 컴포넌트 스타일

import styled from 'styled-components';

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
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
