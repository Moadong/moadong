import styled from 'styled-components';

export const ItemWrapper = styled.div`
  flex: 1;
  height: 45px;
  padding: 12px 18px;
  border: none;
  border-radius: 6px;
  font-size: 1.125rem;
  background-color: #f5f5f5;
  color: #818181;

  &[data-selected='true'] {
    background-color: #ffd9cb;
    color: #111111;
  }
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s;
`;

export const Label = styled.span`
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
