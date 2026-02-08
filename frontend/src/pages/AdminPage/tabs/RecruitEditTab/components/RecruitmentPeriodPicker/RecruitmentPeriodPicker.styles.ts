import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import { colors } from '@/styles/theme/colors';

/* 전체 래퍼 */
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;

  background: ${colors.gray[100]};
  border-radius: 10px;
  padding: 8px 8px;
`;

export const Pill = styled.button<{ $active?: boolean; $padding?: string }>`
  height: 28px;
  padding: ${({ $padding }) => $padding || '6px 10px'};
  border-radius: 100px;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 400;
  white-space: nowrap;

  background: ${({ $active }) =>
    $active ? colors.primary[800] : colors.gray[300]};
  color: ${({ $active }) =>
    $active ? colors.base.white : colors.gray[700]};
`;

/* : */
export const Colon = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: ${colors.gray[600]};
  margin: 0 -3px;
`;

/* 패널 공통 */
export const Panel = styled.div<{ $panel: 'date' | 'hour' | 'minute' }>`
  position: absolute;
  top: calc(100% + 6px);
  z-index: 10;

  ${({ $panel }) => {
    switch ($panel) {
      case 'date':
        return `
          left: 0;
        `;
      case 'hour':
        return `
          left: 75%;
          transform: translateX(-50%);
        `;
      case 'minute':
        return `
          right: 0;
        `;
    }
  }}
`;

/* ===== Hour Picker ===== */
export const HourGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
`;

export const HourItem = styled.button<{ $active: boolean }>`
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;

  background: ${({ $active }) =>
    $active ? colors.primary[800] : colors.gray[100]};
  color: ${({ $active }) =>
    $active ? colors.base.white : colors.gray[700]};
`;

/* ===== Minute Picker ===== */
export const MinuteRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

export const MinuteChip = styled.button<{ $active: boolean }>`
  padding: 8px 12px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;

  background: ${({ $active }) =>
    $active ? colors.primary[800] : colors.gray[100]};
  color: ${({ $active }) =>
    $active ? colors.base.white : colors.gray[700]};
`;

export const MinuteInput = styled.input`
  width: 100%;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${colors.gray[300]};
  padding: 0 10px;
  font-size: 14px;
`;
