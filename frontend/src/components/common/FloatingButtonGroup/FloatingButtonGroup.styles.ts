import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { Z_INDEX } from '@/styles/zIndex';

export const GroupContainer = styled.div`
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: ${Z_INDEX.floatingButton};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;

  ${media.tablet} {
    right: 14px;
    bottom: calc(54px + env(safe-area-inset-bottom) + 14px);
  }
`;

export const FloatingButton = styled.button<{
  $isVisible: boolean;
}>`
  width: 38px;
  height: 38px;
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
    width: 38px;
    height: 38px;
    display: block;
    transition: transform 0.15s ease;
  }

  &:hover img {
    transform: scale(1.12);
  }

  &:active img {
    transform: scale(1.04);
  }
`;
