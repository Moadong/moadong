import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const ModalContent = styled.div`
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  ${media.mobile} {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 2.5rem;
  cursor: pointer;
  padding: 10px;
  opacity: 0.7;
  transition: opacity 0.2s;
  z-index: 3;

  &:hover {
    opacity: 1;
  }
`;

export const ModalHeader = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
`;

export const ClubName = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: #000;
`;

export const ImageCounter = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.95rem;
  font-weight: 500;
  color: #666;
`;

export const ModalBody = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
  padding: 0 60px;

  ${media.mobile} {
    padding: 0 16px;
  }
`;

export const Image = styled.img`
  max-width: 100%;
  max-height: 85%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;

  ${media.mobile} {
    max-height: 100%;
  }
`;

export const NavButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ position }) => (position === 'left' ? 'left: 16px;' : 'right: 16px;')}
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  user-select: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  img {
    width: 28px;
    height: 28px;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  ${media.mobile} {
    display: none;
  }

  ${media.tablet} {
    display: none;
  }
`;

export const ThumbnailContainer = styled.div`
  width: 100%;
  height: 100px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.03), transparent);

  ${media.mobile} {
    height: 80px;
    padding: 0 15px;
  }
`;

export const ThumbnailList = styled.div`
  display: flex;
  gap: 8px;
  max-width: 100%;
  overflow-x: auto;
  padding: 10px;
  align-items: center;
  justify-content: center;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  ${media.tablet} {
    gap: 5px;
    padding: 8px 6px;
  }

  ${media.mobile} {
    gap: 4px;
    padding: 8px 4px;
  }
`;

export const Thumbnail = styled.button<{ isActive: boolean }>`
  border: 2px solid ${({ isActive }) => (isActive ? '#ff5414' : 'transparent')};
  border-radius: 6px;
  padding: 0;
  background: none;
  cursor: pointer;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ isActive }) => (isActive ? '#ff5414' : '#ddd')};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
  }

  ${media.tablet} {
    width: 32px;
    height: 32px;
    border-radius: 4px;
  }

  ${media.mobile} {
    width: 28px;
    height: 28px;
    border-radius: 4px;
  }
`;
