import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { Z_INDEX } from '@/styles/zIndex';

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${HEADER_HEIGHT.mobile}px;
  padding: 0 20px;
  background-color: #ffffff;
  z-index: ${Z_INDEX.header};
`;

export const LogoButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  img {
    width: auto;
    height: 24px;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
  }
`;
