import styled from 'styled-components';
import { theme, Theme } from '@/styles/theme';
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

export const ModalContainer = styled.div<{ isOpen: boolean }>`
  position: relative;
  z-index: ${Z_INDEX.modal};
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  background: transparent;
  border-radius: 10px;
  overflow: visible;
  transition: transform 0.2s ease;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 10px;
`;

export const ImageWrapper = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:active {
    opacity: 0.95;
  }
`;

export const PopupImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${theme.colors.gray[900]};
  border-radius: 0 0 16px 16px;
`;

export const Button = styled.button`
  flex: 1;
  padding: 20px;
  background-color: ${theme.colors.gray[900]};
  color: ${theme.colors.base.white};
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  position: relative;

  &:first-child::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 40%;
    background-color: ${theme.colors.gray[600]};
  }
`;
