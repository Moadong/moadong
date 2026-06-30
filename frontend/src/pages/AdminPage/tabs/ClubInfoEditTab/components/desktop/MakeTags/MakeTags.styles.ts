import styled from 'styled-components';

export const Label = styled.label`
  display: block;
  font-size: 1.125rem;
  margin-bottom: 12px;
  font-weight: 600;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TagItem = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
`;

export const Hashtag = styled.span`
  margin-right: 4px;
  color: #4b4b4b;
  font-weight: bold;
  font-size: 0.875rem;
`;

export const TagTextInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: #4b4b4b;
  width: 100px;
  padding-right: 30px;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 16px;
    height: 16px;
    opacity: 0.5;
  }

  &:hover img {
    opacity: 1;
  }
`;
