import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { Z_INDEX } from '@/styles/zIndex';

export const HEADER_HEIGHT = {
  desktop: 92,
  tablet: 76,
  mobile: 56,
} as const;

export const Header = styled.header<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: ${HEADER_HEIGHT.desktop}px;
  padding: 18px 0;
  background-color: white;
  z-index: ${Z_INDEX.header};

  box-shadow: ${({ isScrolled }) =>
    isScrolled ? '0px 2px 12px rgba(0, 0, 0, 0.04)' : 'none'};
  transition: box-shadow 0.2s ease-in-out;

  ${media.laptop} {
    padding: 18px 20px;
  }
  ${media.tablet} {
    height: ${HEADER_HEIGHT.tablet}px;
    padding: 10px 20px;
  }

  ${media.mobile} {
    height: ${HEADER_HEIGHT.mobile}px;
    padding: 8px 20px;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1180px;
  gap: 16px;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 45px;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 45px;

  ${media.tablet} {
    display: none;
  }
`;

export const NavLink = styled.button<{ $isActive?: boolean }>`
  border: none;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  color: ${({ $isActive }) => ($isActive ? '#FF5414' : '#3A3A3A')};
  background: transparent;
  transition: color 0.2s ease-in-out;

  &:hover {
    opacity: 0.7;
  }
`;

export const SearchArea = styled.div`
  width: 345px;
  max-width: 100%;
  margin-left: auto;

  & > div {
    max-width: none;
  }

  ${media.tablet} {
    flex: 1;
    width: auto;
    margin-left: 0;
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

export const AdminProfileContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const AdminProfileText = styled.div`
  font-size: 14px;
  color: #767676;

  ${media.mobile} {
    display: none;
  }
`;

export const AdminProfileImage = styled.img`
  width: 40px;
  height: auto;
  border-radius: 50%;
`;
