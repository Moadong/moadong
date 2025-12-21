import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const PresidentContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
  max-width: 700px;
`;

export const SNSRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  align-items: flex-start;
`;

export const SNSLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`;
