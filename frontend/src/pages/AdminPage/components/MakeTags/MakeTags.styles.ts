import styled from 'styled-components';
import deleteIcon from "@/assets/images/delete_icon.png";

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
  color: #4B4B4B;
  font-weight: bold;
  font-size: 0.875rem;
`;

export const TagTextInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: #4B4B4B;
  width: 110px;
  padding-right: 10px;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: url(${deleteIcon}) no-repeat center;
  background-size: contain;
  border: none;
  cursor: pointer;
`;