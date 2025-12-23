import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { Z_INDEX } from '@/styles/zIndex';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${Z_INDEX.overlay};
  animation: fadeIn 0.2s ease-in-out;
  background-color: rgba(0, 0, 0, 0.7);
  @supports (backdrop-filter: blur(4px)) {
    backdrop-filter: blur(4px);
    background-color: rgba(0, 0, 0, 0.6);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div`
  width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

export const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 2.5rem;
  cursor: pointer;
  padding: 10px;
  color: #000;
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
  padding: 0 24px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export const ClubName = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
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
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
`;

export const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 10px 12px;

  ${media.mobile} {
    padding: 8px 10px;
  }
`;

export const ThumbnailList = styled.div`
  display: flex;
  gap: 12px;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: center;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  ${media.mobile} {
    gap: 8px;
  }
`;

export const Thumbnail = styled.button<{ isActive: boolean }>`
  border: 2px solid ${({ isActive }) => (isActive ? '#ff5414' : 'transparent')};
  border-radius: 8px;
  padding: 0;
  background: none;
  cursor: pointer;
  width: 50px;
  height: 50px;
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

  ${media.mobile} {
    width: 36px;
    height: 36px;
  }
`;
