import { Z_INDEX } from '@/styles/zIndex';
import styled from 'styled-components';

export const ScrollButton = styled.button<{ $isVisible: boolean }>`
  position: fixed;
  bottom: 80px;
  right: 30px;
  z-index: ${Z_INDEX.floating};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.3s, visibility 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  img {
    width: 50px;
    height: 50px;
    display: block;
  }
`;