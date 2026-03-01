import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Card = styled.div<{ $active: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: 14px;
  background-color: ${({ $active }) => ($active ? '#ffffff' : '#f5f5f5')};
  border: 1px solid ${({ $active }) => ($active ? '#ffded2' : 'transparent')};
  cursor: pointer;
`;

export const ClubName = styled.p<{ $active: boolean }>`
  padding: 0 8px;
  font-size: 16px;
  font-weight: 700;
  line-height: 140%;
  color: ${({ $active }) => ($active ? '#111111' : '#787878')};
`;

export const SongArea = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: ${({ $active }) => ($active ? '8px 12px' : '6px 12px')};
  border-radius: ${({ $active }) => ($active ? '8px' : '20px')};
  background-color: ${({ $active }) => ($active ? '#ffece5' : '#ebebeb')};
  animation: ${fadeIn} 0.15s ease;
`;

export const SongList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: none;
  flex: 1;
`;

export const SongItem = styled.li`
  font-size: 12px;
  font-weight: 400;
  line-height: 140%;
  color: #4b4b4b;
`;

export const CollapsedSong = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 140%;
  color: #989898;
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
  stroke: ${({ $active }) => ($active ? '#ff9f7c' : '#c5c5c5')};
`;
