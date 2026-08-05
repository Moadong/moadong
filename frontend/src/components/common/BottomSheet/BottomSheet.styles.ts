import styled, { css, keyframes } from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { Z_INDEX } from '@/styles/zIndex';

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${Z_INDEX.overlay};
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  touch-action: none;
`;

export const Sheet = styled.div<{
  $background?: string;
  $dragOffset: number;
  $animateBack: boolean;
  $expanded?: boolean;
}>`
  width: 100%;
  max-width: 500px;
  max-height: calc(100dvh - 80px);
  /* 위에 시트가 겹칠 때 내용만큼만 차지하면 뒤 시트가 통째로 가려진다 */
  ${({ $expanded }) =>
    $expanded &&
    css`
      height: calc(100dvh - 80px);
    `}
  background: ${({ $background }) => $background ?? colors.base.white};
  border-radius: 24px 24px 0 0;
  padding: 8px 20px calc(20px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: ${slideUp} 0.25s ease-out;
  touch-action: pan-y;
  transform: ${({ $dragOffset }) =>
    $dragOffset ? `translateY(${$dragOffset}px)` : 'none'};
  transition: ${({ $animateBack }) =>
    $animateBack ? 'transform 0.2s ease-out' : 'none'};
`;

/** 손잡이를 잡고 아래로 끌어 시트를 닫는 영역. 바보다 넓게 잡아야 집기 쉽다. */
export const DragHandle = styled.div`
  flex-shrink: 0;
  padding: 4px 0 16px;
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`;

export const HandleBar = styled.div`
  width: 50px;
  height: 5px;
  border-radius: 3px;
  background: ${colors.gray[400]};
  margin: 0 auto;
`;
