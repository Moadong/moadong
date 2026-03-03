import styled from 'styled-components';

export const Card = styled.div<{ $active: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: 14px;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.base.white : theme.colors.gray[100]};
  border: 1px solid ${({ $active }) => ($active ? '#ffded2' : 'transparent')};
  cursor: pointer;
`;

export const ClubName = styled.p<{ $active: boolean }>`
  padding: 0 8px;
  font-size: 16px;
  font-weight: 700;
  line-height: 140%;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.gray[800] : theme.colors.gray[700]};
`;

export const SongArea = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: ${({ $active }) => ($active ? '8px 12px' : '6px 12px')};
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? '#ffece5' : '#ebebeb')};
`;

export const SongList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: none;
  flex: 1;
  margin-top: 4px;
`;

export const SongItem = styled.li<{ $collapsed?: boolean }>`
  font-size: 12px;
  font-weight: 400;
  line-height: 140%;
  color: ${({ $collapsed, theme }) =>
    $collapsed ? theme.colors.gray[600] : theme.colors.gray[800]};
  transition: color 0.2s ease;
`;

export const ChevronWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 6px 0;
  flex-shrink: 0;
`;

export const ChevronIcon = styled.svg<{ $expanded: boolean; $active: boolean }>`
  width: 10px;
  height: 5px;
  transition: transform 0.2s ease;
  transform: ${({ $expanded }) =>
    $expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  stroke: ${({ $active, theme }) =>
    $active ? '#ff9f7c' : theme.colors.gray[500]};
`;
