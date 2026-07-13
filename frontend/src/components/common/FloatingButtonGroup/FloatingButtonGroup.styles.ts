import styled from 'styled-components';
import { Z_INDEX } from '@/styles/zIndex';

export const GroupContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 80px;
  z-index: ${Z_INDEX.floatingButton};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 12px;
  gap: 8px;
`;

export const FloatingButton = styled.button<{ $isVisible: boolean }>`
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
  }
`;
