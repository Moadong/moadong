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
  height: 190px;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 10px;

  margin: 14px 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;


export const ItemWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const ItemBox = styled.div<{ $active: boolean }>`
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: ${colors.primary[500]};
  }

  ${({ $active }) =>
    $active &&
    css`
      background-color: ${colors.primary[800]};
      color: white;
      font-weight: 500;

      &:hover {
        background-color: ${colors.primary[800]};
      }
    `}
`;

