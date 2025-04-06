import styled from 'styled-components';

export const PhotoEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: hidden;
`;

export const ImageGrid = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  overflow-y: hidden;
  padding-bottom: 24px;
  max-width: 770px;
`;

export const InfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0;
  margin-bottom: 46px;
`;

export const Label = styled.p`
  font-size: 1.125rem;
  margin-bottom: 12px;
  font-weight: 600;
`;
