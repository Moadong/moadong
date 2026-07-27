import styled, { keyframes } from 'styled-components';
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

export const Sheet = styled.div<{ $background?: string }>`
  width: 100%;
  max-width: 500px;
  max-height: calc(100dvh - 80px);
  background: ${({ $background }) => $background ?? colors.base.white};
  border-radius: 24px 24px 0 0;
  padding: 8px 20px calc(20px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: ${slideUp} 0.25s ease-out;
  touch-action: pan-y;
`;

export const HandleBar = styled.div`
  width: 50px;
  height: 5px;
  border-radius: 3px;
  background: ${colors.gray[400]};
  margin: 4px auto 16px;
  flex-shrink: 0;
`;
