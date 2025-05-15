import styled from 'styled-components';

export const TitleButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const InfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0;
  margin-bottom: 46px;
`;

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 140px;
`;

export const PresidentContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
  max-width: 700px;
`;

export const TagEditGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 120px;
`;

export const SNSInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 30px;
`;

export const SNSRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  align-items: flex-start;
`;

export const SNSCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`;
