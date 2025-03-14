import styled from 'styled-components';

export const RecruitEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

export const EditorPreviewContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  width: 100%;
  height: 100%;
`;

export const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const PreviewContainer = styled.div`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
  padding: 10px;
  overflow: hidden;
`;

export const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;

  button {
    padding: 6px 10px;
    border: none;
    background: #e0e0e0;
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;

    &:hover {
      background: #d4d4d4;
    }
  }
`;

export const Editor = styled.textarea`
  width: 100%;
  height: 300px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
`;

export const Paragraph = styled.p`
  line-height: 1.6;
  white-space: pre-wrap;
  margin-bottom: 16px;
`;

export const Blockquote = styled.blockquote`
  padding-left: 10px;
  border-left: 4px solid #ccc;
  color: #555;
`;

export const OrderedList = styled.ol`
  padding-left: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
  line-height: 1.6;
`;

export const UnorderedList = styled.ul`
  padding-left: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
  line-height: 1.6;
`;

export const ListItem = styled.li`
  padding-left: 5px;
  margin-bottom: 4px;
`;
