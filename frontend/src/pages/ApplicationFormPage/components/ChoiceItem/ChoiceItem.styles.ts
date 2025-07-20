import styled from 'styled-components';

export const ItemWrapper = styled.div<{ 'data-selected'?: string }>`
  flex: 1;
  height: 45px;
  padding: 12px 18px;
  border: none;
  border-radius: 6px;
  font-size: 1.125rem;
  background-color: ${({ 'data-selected': selected }) =>
        selected === 'true' ? '#FFECE5' : '#F5F5F5'};
  color: ${({ 'data-selected': selected }) =>
        selected === 'true' ? '#111111' : '#818181'};
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
`;

export const Label = styled.span`
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
