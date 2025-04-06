import styled from 'styled-components';

export const RecruitEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

export const EditButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: hidden;
`;

export const ImageListContainer = styled.div`
  width: 100%;
`;

export const ImageGrid = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  overflow-y: hidden;
  padding-bottom: 24px;
`;
