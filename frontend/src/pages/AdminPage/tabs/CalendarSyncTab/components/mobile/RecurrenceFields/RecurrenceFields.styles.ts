import styled from 'styled-components';
import { CALENDAR_EVENT_COLORS } from '@/constants/calendarEventColors';
import { colors } from '@/styles/theme/colors';

const PINK = CALENDAR_EVENT_COLORS.PINK.main;

export const Container = styled.div`
  background: ${colors.base.white};
  border-radius: 16px;
  padding: 4px 14px;
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 46px;
`;

export const RowLabel = styled.span`
  font-size: 0.92rem;
  font-weight: 600;
  color: ${colors.gray[900]};
`;

export const RowValueButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  font-size: 0.92rem;
  color: ${colors.gray[800]};
  cursor: pointer;
  padding: 4px 0;
`;

/** 캘린더에서 정해진 반복 기간을 보여주는 표시 전용 값 */
export const RowValue = styled.span`
  font-size: 0.92rem;
  color: ${colors.gray[800]};
`;

export const Chevron = styled.span<{ $open?: boolean }>`
  font-size: 0.7rem;
  color: ${colors.gray[500]};
  transform: rotate(${({ $open }) => ($open ? 180 : 0)}deg);
  transition: transform 0.15s;
`;

export const DropdownAnchor = styled.div`
  position: relative;
`;

export const DropdownList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 5;
  margin: 0;
  padding: 4px;
  list-style: none;
  min-width: 76px;
  background: ${colors.base.white};
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
`;

export const DropdownItem = styled.li<{ $active: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.88rem;
  text-align: center;
  cursor: pointer;
  color: ${({ $active }) => ($active ? colors.gray[900] : colors.gray[500])};
  background: ${({ $active }) => ($active ? colors.gray[100] : 'transparent')};

  &:hover {
    background: ${colors.gray[100]};
  }
`;

export const WeekdayChipRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0 10px;
`;

export const WeekdayChip = styled.button<{ $active: boolean }>`
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  font-size: 0.88rem;
  cursor: pointer;
  background: ${({ $active }) => ($active ? PINK : colors.gray[100])};
  color: ${({ $active }) => ($active ? colors.base.white : colors.gray[600])};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  transition:
    background 0.15s,
    color 0.15s;
`;
