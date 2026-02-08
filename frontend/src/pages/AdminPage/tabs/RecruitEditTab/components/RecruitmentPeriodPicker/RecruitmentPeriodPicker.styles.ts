import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import { colors } from '@/styles/theme/colors';

/* 전체 래퍼 */
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

/* 날짜 / 시간 pill 공통 */
export const Pill = styled.button<{ $active?: boolean }>`
  height: 45px;
  padding: 0 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;

  font-size: 16px;
  font-weight: 500;

  background: ${({ $active }) =>
    $active ? colors.primary[800] : colors.gray[100]};
  color: ${({ $active }) =>
    $active ? colors.base.white : colors.gray[700]};
`;

/* : */
export const Colon = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.gray[600]};
`;

/* ~ */
export const Tilde = styled.span`
  margin: 0 8px;
  font-size: 18px;
`;

/* 패널 공통 */
export const Panel = styled.div`
  position: absolute;
  top: 52px;
  z-index: 20;
  background: ${colors.base.white};
  border-radius: 12px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
  padding: 16px;
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
