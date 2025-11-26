import styled from 'styled-components';

export const AdminPageContainer = styled.div`
  display: flex;
  margin-top: 98px;
  align-items: flex-start;
  position: relative;
`;

export const Divider = styled.div`
  position: sticky;
  top: 98px;
  width: 1px;
  height: calc(100vh - 98px);
  background-color: #dcdcdc;
  margin: 0 34px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Content = styled.main`
  width: 100%;
  max-width: 977px;
  padding: 62px 58px;

  @media (max-width: 768px) {
    padding: 20px;
    width: 100%;
  }
`;

export const DesktopSideBarWrapper = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ff7543;
  color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
  font-size: 24px;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;
