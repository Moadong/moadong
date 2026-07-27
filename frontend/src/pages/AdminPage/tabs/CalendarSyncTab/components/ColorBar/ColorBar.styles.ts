import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

export const ColorChip = styled.button<{ $color: string; $selected: boolean }>`
  flex: ${({ $selected }) => ($selected ? 3 : 1)};
  height: 8px;
  border: none;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  cursor: pointer;
  padding: 0;
  transition: flex 0.2s ease;
`;
