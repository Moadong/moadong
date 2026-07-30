import styled, { css } from 'styled-components';
import { CALENDAR_EVENT_COLORS } from '@/constants/calendarEventColors';
import { colors } from '@/styles/theme/colors';

/** 요일 헤더·일요일 숫자에 쓰는 고정 색 (선택 색상과 무관) */
const SUNDAY_PINK = CALENDAR_EVENT_COLORS.PINK.main;
const SATURDAY_BLUE = colors.accent[1][900];

export const Container = styled.div`
  background: ${colors.base.white};
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MonthLabel = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.gray[900]};
`;

export const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ArrowButton = styled.button`
  border: none;
  background: transparent;
  color: ${colors.gray[500]};
  font-size: 0.8rem;
  cursor: pointer;
  padding: 4px;
`;

export const TodayButton = styled.button`
  border: none;
  border-radius: 8px;
  background: ${colors.gray[100]};
  color: ${colors.gray[800]};
  font-size: 0.78rem;
  padding: 4px 10px;
  cursor: pointer;
`;

export const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

export const Weekday = styled.span<{ $dayIndex: number }>`
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ $dayIndex }) =>
    $dayIndex === 0
      ? SUNDAY_PINK
      : $dayIndex === 6
        ? SATURDAY_BLUE
        : colors.gray[600]};
`;

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 6px;
`;

interface DayCellProps {
  $dayIndex: number;
  $isCurrentMonth: boolean;
  $isSelected: boolean;
  $isToday: boolean;
  $inRange: boolean;
  $isRangeStart: boolean;
  $isRangeEnd: boolean;
  /** 선택 색상 (ColorBar 연동) */
  $accentBack: string;
  /** 고를 수 없는 날짜. 달 밖 날짜와 달리 숨기지 않고 흐리게만 둔다 */
  $isBlocked: boolean;
}

export const DayCell = styled.button<DayCellProps>`
  position: relative;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  cursor: ${({ $isBlocked }) => ($isBlocked ? 'not-allowed' : 'pointer')};
  padding: 0;
  visibility: ${({ $isCurrentMonth }) =>
    $isCurrentMonth ? 'visible' : 'hidden'};
  color: ${({ $dayIndex, $isSelected, $isBlocked }) => {
    if ($isBlocked) return colors.gray[400];
    if ($isSelected) return colors.base.white;
    if ($dayIndex === 0) return SUNDAY_PINK;
    if ($dayIndex === 6) return SATURDAY_BLUE;
    return colors.gray[900];
  }};

  /* 기간 하이라이트 배경 띠 */
  ${({ $inRange, $isRangeStart, $isRangeEnd, $accentBack }) =>
    $inRange &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 3px;
        bottom: 3px;
        left: ${$isRangeStart ? '50%' : 0};
        right: ${$isRangeEnd ? '50%' : 0};
        background: ${$accentBack};
        z-index: 0;
      }
    `}
`;

export const DayNumber = styled.span<{
  $isSelected: boolean;
  $isToday: boolean;
  $accentMain: string;
}>`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ $isSelected, $isToday, $accentMain }) => {
    if ($isSelected) return $accentMain;
    if ($isToday) return colors.gray[200];
    return 'transparent';
  }};
  font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 400)};
`;
