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
  background-color: #ff7543;

  padding: 10px 40px;
  width: 517px;
  height: 50px;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  color: #fff;
  text-align: center;

  img {
    font-size: 12px;
    font-weight: 600;
  }

  @media (max-width: 500px) {
    width: 280px;
  }
`;

export const Separator = styled.span`
  margin: 0 8px;
  border-left: 1px solid #787878;
  height: 12px;
  display: inline-block;
`;