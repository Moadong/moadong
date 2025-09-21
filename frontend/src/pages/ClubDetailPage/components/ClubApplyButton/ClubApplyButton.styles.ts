import styled from 'styled-components';

export const ApplyButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  gap: 10px;
`;

export const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  background-color: #3a3a3a;

  padding: 10px 40px;
  width: 517px;
  height: 44px;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  color: #fff;
  text-align: center;

  &:hover {
    background-color: #555;
    transform: scale(1.03);
  }

  img {
    font-size: 12px;
    font-weight: 600;
  }

  @media (max-width: 500px) {
    width: 280px;
  }
`;
