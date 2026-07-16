import styled, { css, keyframes } from 'styled-components';
import { Z_INDEX } from '@/styles/zIndex';

const bounceUp = keyframes`
  0%, 100% { transform: scale(1.18) translateY(0); }
  50% { transform: scale(1.18) translateY(-4px); }
`;

const wiggle = keyframes`
  0%   { transform: scale(1.18) rotate(0deg); }
  20%  { transform: scale(1.18) rotate(-18deg); }
  40%  { transform: scale(1.18) rotate(14deg); }
  60%  { transform: scale(1.18) rotate(-10deg); }
  80%  { transform: scale(1.18) rotate(6deg); }
  100% { transform: scale(1.18) rotate(0deg); }
`;

export const GroupContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 100px;
  z-index: ${Z_INDEX.floatingButton};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 12px;
  gap: 8px;
`;

export const FloatingButton = styled.button<{
  $isVisible: boolean;
  $variant: 'scroll' | 'share';
}>`
  width: 33px;
  height: 33px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s,
    visibility 0.3s;

  img {
    width: 33px;
    height: 33px;
    display: block;
    transition: transform 0.15s ease;
  }

  ${({ $variant }) =>
    $variant === 'scroll'
      ? css`
          &:hover img {
            animation: ${bounceUp} 0.55s ease infinite;
          }
        `
      : css`
          &:hover img {
            animation: ${wiggle} 0.55s ease forwards;
          }
        `}

  &:active img {
    transform: scale(1.08);
  }
`;
