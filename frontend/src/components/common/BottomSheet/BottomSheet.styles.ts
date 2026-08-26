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

/**
 * 위에 시트를 겹칠 때 뒤 시트를 이만큼 더 드러나게 들어올린다.
 * 높이를 늘리면 내용이 짧은 시트에 빈 공간만 생기므로 위치를 옮긴다.
 * 겹치는 시트보다 작아야 들어올린 만큼의 아래 틈이 가려진다.
 */
const STACKED_LIFT = 180;

export const Sheet = styled.div<{
  $background?: string;
  $dragOffset: number;
  $animateBack: boolean;
  $stacked?: boolean;
}>`
  width: 100%;
  max-width: 500px;
  max-height: calc(100dvh - 80px);
  /* 열릴 때 포커스를 받으므로 시트 전체를 두르는 기본 포커스 링을 지운다 */
  outline: none;
  ${({ $stacked }) =>
    $stacked &&
    css`
      margin-bottom: ${STACKED_LIFT}px;
      max-height: calc(100dvh - 80px - ${STACKED_LIFT}px);
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
