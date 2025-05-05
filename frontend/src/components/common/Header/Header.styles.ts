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
