import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme/colors';

const itemBase = css`
  height: 26px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 7px;
  font-size: 12px;
  border-radius: 6px;
  transition:
    background-color 0.08s ease,
    color 0.08s ease;
`;

export const TimeContainer = styled.div`
  width: 50px;
  height: 275px;
  background: ${colors.base.white};
  box-shadow: 0 0 8px rgba(172, 172, 172, 0.5);
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 0 0 5px;
`;

export const TimeHeader = styled.div`
  padding: 10px 0;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: ${colors.base.white};
  background: ${colors.primary[800]};
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  border-radius: 8px 8px 0 0;
`;

export const TimeList = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.gray[300]};);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const TimeItem = styled.div<{ $active: boolean }>`
  ${itemBase};

  ${({ $active }) =>
    $active
      ? css`
          background: ${colors.primary[800]};
          color: ${colors.base.white};
          font-weight: 600;
        `
      : css`
          &:hover {
            background: rgba(255, 84, 20, 0.12);
          }
        `}
`;
