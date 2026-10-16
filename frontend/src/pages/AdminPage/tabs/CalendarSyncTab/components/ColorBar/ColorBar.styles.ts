import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

/** 색 막대는 8px로 보이되, 모바일에서 누를 수 있도록 버튼 자체는 24px을 확보한다 */
export const ColorChip = styled.button<{ $color: string; $selected: boolean }>`
  flex: ${({ $selected }) => ($selected ? 3 : 1)};
  height: 24px;
  display: flex;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  transition: flex 0.2s ease;

  &::after {
    content: '';
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: ${({ $color }) => $color};
  }
`;
