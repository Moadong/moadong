import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 62px;
  padding: 10px 40px;
  background-color: white;
  z-index: 2;

  ${media.tablet} {
    height: 56px;
    padding: 10px 40px;
  }

  ${media.mobile}{
    padding: 5px 20px;
  }

  ${media.mobile}{
    padding: 5px 10px;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  gap: 50px;

  ${media.tablet} {
    gap: 35px;
  }
  ${media.mobile} {
    gap: 30px;
  }
  ${media.mini_mobile} {
    gap: 15px;
  }
`;

export const LogoButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  .desktop-logo {
    display: block;
    width: 152px;
    height: auto;
  }

  .mobile-logo {
    display: none;
  }

  @media (max-width: 870px) {
    .desktop-logo {
      display: none;
    }
    .mobile-logo {
      display: block;
      width: 32px;
      height: auto;
    }
  }
`;

export const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 45px;

  ${media.tablet} {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: #fff;
    margin-bottom: 16px;
    border-radius: 0 0 20px 20px;
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.16);
    transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-200%')});
    transition: opacity 0.3s ease-in-out;
    z-index: 1;
  }
`;

export const NavLink = styled.button<{ isActive?: boolean }>`
  border: none;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  color: ${({ isActive }) => (isActive ? '#FF5414' : '#3A3A3A')};
  background: transparent;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.7;
  }

  ${media.tablet} {
    display: inline-flex;
    padding: 12px 24px;
    background: ${({ isActive }) => (isActive ? 'rgba(255, 84, 20, 0.08)' : 'none')};
    
    &:last-child {
      margin-bottom: 16px;
    }
  }
`;

export const MenuButton = styled.button<{ isOpen: boolean }>`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 18px;
  position: relative;
  z-index: 3;

  ${media.tablet} {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  ${media.mobile} {
    width: 20px;
  }

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: #4B4B4B;
    border-radius: 2px;
    transition: all 0.3s ease-in-out;
    transform-origin: center;
  }

  ${({ isOpen }) =>
    isOpen &&
    `
    span:nth-child(1) {
      transform: translateY(8.25px) rotate(45deg);
    }
    
    span:nth-child(2) {
      opacity: 0;
    }
    
    span:nth-child(3) {
      transform: translateY(-8.25px) rotate(-45deg);
    }
  `}
`;