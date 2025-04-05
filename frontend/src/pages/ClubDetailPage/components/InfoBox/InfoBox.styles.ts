import styled from 'styled-components';

export const InfoBoxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 34px;
  margin-top: 100px;

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 0px;
    margin-top: 40px;
  }
`;

export const InfoBox = styled.div`
  width: 573px;
  height: 164px;
  border-radius: 18px;
  border: 1px solid #dcdcdc;
  padding: 30px;

  @media (max-width: 500px) {
    width: 100%;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #dcdcdc;
    padding: 20px;
  }
`;

export const Title = styled.p`
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.02px;
`;

export const DescriptionContainer = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  width: 232px;
  height: 48px;
  border: none;
  gap: 15px;
`;

export const DescriptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 50px;
  font-size: 14px;
`;

export const LeftText = styled.p`
  color: #9d9d9d;
  white-space: nowrap;
`;

export const RightText = styled.p`
  flex-grow: 1;
  white-space: nowrap;

  @media (max-width: 900px) {
    white-space: normal;
  }

  @media (max-width: 500px) {
    white-space: nowrap;
  }
`;
