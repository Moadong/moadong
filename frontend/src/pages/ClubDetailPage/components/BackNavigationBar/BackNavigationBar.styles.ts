import styled from 'styled-components';

export const BackNavigationContainer = styled.div`
  display: none;

  @media (max-width: 500px) {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 70px;

    background-color: white;
  }
`;

export const BackNavigationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 65px 20px;
  position: relative;
`;

export const BackImage = styled.img`
  cursor: pointer;

  @media (max-width: 500px) {
    width: 15px;
    height: 11px;
  }
`;

export const NavigationText = styled.p`
  font-size: 14px;
  letter-spacing: -0.02px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
`;
