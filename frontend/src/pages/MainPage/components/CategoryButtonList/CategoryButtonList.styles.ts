import styled from 'styled-components';

export const CategoryButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-top: 60px;

  @media (max-width: 500px) {
    margin: 0 -10px;
    margin-top: 16px;
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
  padding: 8px;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.95);
  }

  img {
    width: 36px;
    height: 36px;
    transition: transform 0.2s ease;

    @media (max-width: 500px) {
      margin-top: 5px;
      width: 30px;
      height: 30px;
    }
    @media (max-width: 360px) {
      width: 25px;
      height: 25px;
    }
  }

  span {
    font-size: 1rem;
    font-weight: 500;
    margin-top: 11px;
    line-height: 30px;
    white-space: nowrap;

    @media (max-width: 768px) {
      font-size: 14px;
      margin-top: 10px;
    }

    @media (max-width: 500px) {
      font-size: 12px;
      margin-top: 11px;
      line-height: normal;
      margin-bottom: 5px;
    }

    @media (max-width: 375px) {
      font-size: 11px;
      margin-top: 8px;
      line-height: normal;
    }
  }
`;
