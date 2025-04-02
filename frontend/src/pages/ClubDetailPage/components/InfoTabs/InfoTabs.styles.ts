import styled from 'styled-components';

export const InfoTabWrapper = styled.div`
  display: none;
  position: sticky;
  top: 70px;
  z-index: 1;

  @media (max-width: 500px) {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 45px;
    background-color: white;
    margin-top: 40px;
  }
`;

export const InfoTabButton = styled.button`
  width: 25%;
  border: none;
  border-bottom: 2px solid #cdcdcd;
  background-color: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #cdcdcd;
  transition: border-bottom 0.3s ease;

  &.active {
    border-bottom: 2px solid black;
    color: black;
  }
`;
