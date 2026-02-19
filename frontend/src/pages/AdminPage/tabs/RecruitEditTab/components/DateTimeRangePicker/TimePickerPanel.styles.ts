import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  display: flex;
`;

export const Column = styled.div`
  width: 60px;
`;

export const Header = styled.div`
  height: 44px;
  background: ${colors.primary[800]};
  color: ${colors.base.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  padding: 0;
`;

export const List = styled.div`
  height: 260px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Item = styled.div<{ $active: boolean }>`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  margin: 0 12px;

  &:hover {
    background: ${colors.primary[500]};

  }

  ${({ $active }) =>
    $active &&
    css`
      background: ${colors.primary[800]};
      color: white;
      font-weight: 600;
    `}
`;
