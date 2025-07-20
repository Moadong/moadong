import styled from 'styled-components';

export const AddItemButton = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.875rem;
  font-weight: 500;
  background: white;
  color: #555;
  margin-top: 8px;
  cursor: pointer;
`;

export const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const DeleteButton = styled.button`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #ffecec;
  color: #e33;
  border: 1px solid #f99;
  cursor: pointer;
`;
