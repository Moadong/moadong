import styled from 'styled-components';

export const Spacer = styled.div`
  flex-grow: 1;
`;

export const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 400px;
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
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover {
      background: #d4d4d4;
    }

    img {
      width: 16px;
      height: 16px;
    }
  }
`;

export const Editor = styled.textarea`
  flex-grow: 1;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  overflow: hidden;
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
