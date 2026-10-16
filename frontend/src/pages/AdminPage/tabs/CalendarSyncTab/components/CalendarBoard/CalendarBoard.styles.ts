import styled from 'styled-components';
import { CALENDAR_EVENT_COLORS } from '@/constants/calendarEventColors';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

const PINK = CALENDAR_EVENT_COLORS.PINK.main;
const SATURDAY_BLUE = colors.accent[1][900];

/**
 * 날짜 칸 사이 간격 (Figma 스펙 "사이값 8").
 * 기간 일정 막대는 grid span으로 이 간격까지 함께 덮어 하나로 이어진다.
 */
const CELL_GAP = '8px';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
`;

export const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const MonthLabel = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${colors.gray[900]};
`;

export const ArrowButton = styled.button`
  border: none;
  background: transparent;
  color: ${colors.gray[500]};
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px;
`;

export const TodayButton = styled.button`
  border: none;
  border-radius: 10px;
  background: ${colors.gray[100]};
  color: ${colors.gray[800]};
  font-size: 0.85rem;
  padding: 5px 14px;
  cursor: pointer;
`;

export const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${CELL_GAP};
`;

export const Weekday = styled.span<{ $dayIndex: number }>`
  text-align: center;
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ $dayIndex }) =>
    $dayIndex === 0
      ? PINK
      : $dayIndex === 6
        ? SATURDAY_BLUE
        : colors.gray[700]};
`;

export const WeekList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Week = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-height: 120px;
  padding: 8px 0;

  ${media.tablet} {
    min-height: 84px;
    padding: 6px 0;
  }
`;

/** 날짜 칸 전체를 덮는 클릭 영역. 숫자·이벤트 막대 뒤에 깔린다. */
export const DayHitRow = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${CELL_GAP};
`;

export const DayHitCell = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

export const DayNumberRow = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${CELL_GAP};
  /* 클릭은 뒤의 DayHitCell이 받는다 */
  pointer-events: none;
`;

export const DayNumberCell = styled.div<{ $isCurrentMonth: boolean }>`
  display: flex;
  justify-content: center;
  opacity: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 1 : 0.35)};
`;

export const DayNumber = styled.span<{ $dayIndex: number; $isToday: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 0.95rem;
  background: ${({ $isToday }) =>
    $isToday ? colors.gray[200] : 'transparent'};
  color: ${({ $dayIndex }) =>
    $dayIndex === 0
      ? PINK
      : $dayIndex === 6
        ? SATURDAY_BLUE
        : colors.gray[900]};

  ${media.tablet} {
    width: 26px;
    height: 26px;
    font-size: 0.9rem;
  }
`;

export const EventLayer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  /* 세로는 촘촘하게, 가로는 날짜 칸 간격과 동일하게 */
  gap: 2px ${CELL_GAP};
  align-content: start;
  /* 막대 사이 빈 공간의 클릭은 뒤의 DayHitCell로 넘긴다 */
  pointer-events: none;
`;

/**
 * 이벤트 막대. 기간 일정은 여러 칸을 가로질러($span > 1) 하나로 이어진다.
 */
export const EventBar = styled.button<{
  $color: string;
  $back: string;
  $startIndex: number;
  $span: number;
  $lane: number;
}>`
  grid-column: ${({ $startIndex, $span }) =>
    `${$startIndex + 1} / span ${$span}`};
  grid-row: ${({ $lane }) => $lane + 1};
  min-width: 0;
  pointer-events: auto;
  border: none;
  border-radius: 4px;
  background: ${({ $back }) => $back};
  color: ${({ $color }) => $color};
  font-size: 0.78rem;
  line-height: 1.6;
  padding: 2px 6px;
  cursor: pointer;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${media.tablet} {
    font-size: 0.62rem;
    line-height: 1.5;
    padding: 1px 3px;
  }
`;
