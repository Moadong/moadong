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
  // width: 63px;
  flex-shrink: 0
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
    height: 56px;
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
  width: 32.562px;
  height: 26px;
  background-color: transparent;
  border: none;
  cursor: pointer;

  img {
    width: 32.562px;
    height: auto;
    object-fit: cover;
  }
`;

export const MobileMenu = styled.button`
  width: 20px;
  height: 16px;
  background-color: transparent;
  border: none;
  cursor: pointer;

  img {
    width: 20px;
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
  gap: 150px;
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


export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 45px;
  cursor: pointer;
  height: 43px;
  font-weight: 500;
  font-size: 14px;
  line-height: 42px; /* 텍스트 수직 정렬의 핵심입니다! */
  color: inherit;
  text-decoration: none;
`;


export const DropdownMenu = styled.div`
  display: block;
  position: absolute;
  top: 100%; // 부모 요소 바로 아래에 위치시킵니다.
  left: 50%;
  transform: translateX(-50%); // 가운데 정렬합니다.
  background-color: white;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 3; // 다른 요소들 위에 보이도록 z-index를 높게 설정합니다.
  padding: 8px 0;
`;

export const DropdownItem = styled.div`
  color: black;
  padding: 4px 16px;
  text-decoration: none;
  display: block;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;

  &:hover {
    background-color: #f1f1f1;
  }
`;