import styled from 'styled-components';
import { Z_INDEX } from '@/styles/zIndex';

export const Overlay = styled.div<{ isOpen: boolean }>`
  inset: 0;
  position: fixed;
  z-index: ${Z_INDEX.overlay};
  background: rgba(0, 0, 0, ${({ isOpen }) => (isOpen ? 0.45 : 0)});
  display: grid;
  place-items: center;
  padding: 24px;
  transition: background-color 0.2s ease;
`;

export const Container = styled.div<{ isOpen: boolean }>`
  position: relative;
  z-index: ${Z_INDEX.modal};
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${({ isOpen }) =>
    isOpen ? '0 18px 44px rgba(0,0,0,.22)' : 'none'};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
`;

export const Header = styled.div`
  padding: 30px;
  border-bottom: 1px solid #dcdcdc;
  display: flex;
  align-items: center;
`;

export const Title = styled.h3`
  font-size: 20px;
  font-weight: 800;
  flex: 1;
  text-align: left;
`;

export const IconButton = styled.button`
  border: none;
  background: transparent;
  font-size: 20px;
  font-weight: 800;
  color: #9d9d9d;
  line-height: 1;
  cursor: pointer;
`;

export const Description = styled.p`
  padding: 20px 32px 0px;
  text-align: left;
  color: #9d9d9d;
  font-weight: 600;
`;

export const Body = styled.div`
  padding: 16px 30px 30px;
  overflow: auto;
`;
