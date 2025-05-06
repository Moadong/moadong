import styled from 'styled-components';

export const HeaderStyles = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 62px;
  padding: 10px 40px;
  max-width: 1180px;
  margin: 0 auto;
  z-index: 2;
  background-color: white;

  @media (max-width: 500px) {
    display: none;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 80px;

  @media (max-width: 698px) {
    gap: 50px;
  }
`;

export const TextCoverStyles = styled.div`
  display: flex;
  width: 365px;
  white-space: nowrap;

  @media (max-width: 698px) {
    width: 220px;
  }
`;

export const LogoButtonStyles = styled.button`
  width: 152px;
  height: 43px;
  background-color: transparent;
  border: none;
  color: #000000;
  cursor: pointer;

  img {
    width: 152px;
    height: auto;
    object-fit: cover;
  }

  @media (max-width: 698px) {
    width: 117px;
    height: 41px;

    img {
      width: 117px;
    }
  }
`;

export const IntroduceButtonStyles = styled.a`
  margin-left: 45px;
  width: 63px;
  height: 43px;
  font-weight: 500;
  font-size: 14px;
  line-height: 42px;
  cursor: pointer;
  color: inherit;
  text-decoration: none;

  &:visited {
    color: inherit;
    text-decoration: none;
  }

  @media (max-width: 698px) {
    width: 63px;
    height: 43px;
  }
`;

export const MobileHeaderContainer = styled.header`
  display: none;

  @media (max-width: 500px) {
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    right: 0;
    height: 46px;
    padding: 0px 20px;
    margin: 0 auto;
    z-index: 2;
    background-color: white;
  }
`;

export const MobileHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const MobileMainIcon = styled.button`
  width: 26px;
  height: 22px;
  background-color: transparent;
  border: none;
  cursor: pointer;

  img {
    width: 26px;
    height: auto;
    object-fit: cover;
  }
`;

export const MobileMenu = styled.button`
  width: 18px;
  height: 14px;
  background-color: transparent;
  border: none;
  cursor: pointer;

  img {
    width: 18px;
    height: auto;
    object-fit: cover;
  }
`;

export const DrawerContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: ${({ isOpen }) => (isOpen ? '0' : '-175px')};
  height: 175px;
  left: 0;
  right: 0;
  border-radius: 0px 0px 20px 20px;
  background: #fff;
  box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.25);
  transition: top 0.2s ease-in-out;
  z-index: 2;
  padding: 20px;

  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
`;

export const DrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 34.75px;
`;

export const DrawerHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 280px;
`;

export const DrawerMainIcon = styled.img`
  width: 158px;
  height: 32.25px;
  flex-shrink: 0;
  cursor: pointer;
`;

export const DrawerDeleteIcon = styled.img`
  width: 17px;
  height: 17px;
  flex-shrink: 0;
`;

export const MenubarIntroduceBox = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 6px 36px;
  border-radius: 52px;
  background: rgba(255, 84, 20, 0.08);
  cursor: pointer;
`;
