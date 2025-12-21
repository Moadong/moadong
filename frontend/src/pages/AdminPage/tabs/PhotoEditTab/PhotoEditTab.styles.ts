import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

export const ImageGrid = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  overflow-y: hidden;
  padding-bottom: 24px;
  max-width: 770px;
`;

export const Label = styled.p`
  font-size: 1.125rem;
  margin-bottom: 8px;
  font-weight: 600;
`;
