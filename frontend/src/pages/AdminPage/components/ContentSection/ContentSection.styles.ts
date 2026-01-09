import styled from 'styled-components';

export const ContentSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const ContentSectionHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 42px;
`;

export const ContentSectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0;
  margin: 0;
`;

export const ContentSectionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
