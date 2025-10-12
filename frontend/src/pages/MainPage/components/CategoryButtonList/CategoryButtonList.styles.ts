import styled from 'styled-components';

export const CategoryButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-top: 32px;

  @media (max-width: 500px) {
    margin: 16px 0 12px 0; 
    background-color: white;
    position: sticky;
    top: 56px;
    z-index: 1;
  }
`;

export const CategoryButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
  padding: 10px 0px;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.95);
  }

  img {
    width: 56px;
    height: 56px;
    transition: transform 0.2s ease;

    @media (max-width: 500px) {
      width: 40px;
      height: 40px;
    }
    @media (max-width: 360px) {
      width: 23px;
      height: 23px;
    }
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: #787878;
    margin-top: 8px;
    line-height: 17px;
    white-space: nowrap;

    @media (max-width: 768px) {
      font-size: 12px;
      margin-top: 10px;
    }

    @media (max-width: 500px) {
      font-size: 10px;
      margin-top: 4px;
      line-height: normal;
    }

    @media (max-width: 375px) {
      font-size: 10px;
      margin-top: 2px;
      line-height: normal;
    }
  }
`;
