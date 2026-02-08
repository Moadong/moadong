import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme/colors';

const itemBase = css`
  height: 40px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

export const TimeContainer = styled.div`
  width: 60px;
  height: 330px;
  background: ${colors.base.white};
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
`;

export const TimeHeader = styled.div`
  padding: 10px 0;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: #111;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
`;

export const TimeList = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.25);
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
