import styled from 'styled-components';

export const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0,0,0, ${({ isOpen }) => (isOpen ? 0.45 : 0)});
  display: grid;
  place-items: center;
  padding: 24px;
  transition: background-color .2s ease;
`;

export const Container = styled.div<{ isOpen: boolean }>`
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${({ isOpen }) => (isOpen ? '0 18px 44px rgba(0,0,0,.22)' : 'none')};
  transition: transform .2s ease, box-shadow .2s ease;
`;

export const Header = styled.div`
  padding: 30px;
  border-bottom: 1px solid #DCDCDC;
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
  color: #9D9D9D;
  line-height: 1;
  cursor: pointer;
`;

export const Description = styled.p`
  padding: 20px 32px 0px;
  text-align: left;
  color: #9D9D9D;
  font-weight: 600;
`;

export const Body = styled.div`
  padding: 16px 30px 30px;
  overflow: auto;
`;
