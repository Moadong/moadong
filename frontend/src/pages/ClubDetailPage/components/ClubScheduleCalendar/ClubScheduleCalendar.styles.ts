import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

/** 날짜 칸 지름. 칸은 고정 폭이고 남는 공간은 칸 사이로 균등 분배된다. */
const CELL_SIZE = '34px';

/** 요일/날짜 행 공통 그리드. 기간 띠가 칸 사이 여백까지 함께 덮어 하나로 이어진다. */
const cellGrid = `
  display: grid;
  grid-template-columns: repeat(7, ${CELL_SIZE});
  justify-content: space-between;
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 16px 100px;
  background-color: ${colors.gray[100]};
`;

/** Container가 align-items: flex-start라 감싸지 않으면 스피너가 왼쪽에 붙는다 */
export const LoadingArea = styled.div`
  width: 100%;
`;

export const MonthHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MonthLabel = styled.h3`
  ${setTypography(typography.title.title5)};
  letter-spacing: -0.4px;
  color: ${colors.gray[900]};
`;

export const MonthMoveButton = styled.button`
  width: 14px;
  height: 14px;
  border: none;
  background: transparent;
  color: ${colors.gray[400]};
  font-size: 11px;
  line-height: 1;
  padding: 0;
  cursor: pointer;
`;

export const TodayButton = styled.button`
  border: none;
  border-radius: 8px;
  background-color: ${colors.gray[300]};
  color: ${colors.gray[800]};
  ${setTypography(typography.button.button2)};
  letter-spacing: -0.24px;
  padding: 4px 12px;
  cursor: pointer;
`;

export const CalendarCard = styled.section`
  width: 100%;
  border-radius: 12px;
  background-color: ${colors.base.white};
  padding: 10px 10px 24px;
`;

export const WeekdayGrid = styled.div`
  ${cellGrid};
`;

export const Weekday = styled.span<{ $dayIndex: number }>`
  height: ${CELL_SIZE};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${setTypography(typography.paragraph.p2)};
  letter-spacing: -0.32px;
  color: ${({ $dayIndex }) =>
    $dayIndex === 0
      ? colors.secondary[1].main
      : $dayIndex === 6
        ? colors.accent[1][900]
        : colors.gray[600]};
`;

export const WeekList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Week = styled.div`
  position: relative;
  height: ${CELL_SIZE};
`;

/** 기간 일정의 배경 띠. 날짜 숫자 뒤에 깔린다. */
export const BandLayer = styled.div`
  position: absolute;
  inset: 0;
  ${cellGrid};
`;

export const Band = styled.div<{
  $startIndex: number;
  $span: number;
  $back: string;
}>`
  grid-column: ${({ $startIndex, $span }) =>
    `${$startIndex + 1} / span ${$span}`};
  grid-row: 1;
  border-radius: 100px;
  background-color: ${({ $back }) => $back};
`;

export const DayGrid = styled.div`
  position: relative;
  ${cellGrid};
`;

export const DayCell = styled.div<{ $isCurrentMonth: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 1 : 0)};
`;

export const DayNumber = styled.span<{
  $dayIndex: number;
  $fill?: string;
  $isToday: boolean;
}>`
  width: ${CELL_SIZE};
  height: ${CELL_SIZE};
  border-radius: 100px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${setTypography(typography.paragraph.p3)};
  letter-spacing: -0.32px;
  background-color: ${({ $fill, $isToday }) =>
    $fill ?? ($isToday ? colors.gray[300] : 'transparent')};
  color: ${({ $fill, $dayIndex }) => {
    if ($fill) return colors.base.white;
    if ($dayIndex === 0) return colors.secondary[1].main;
    if ($dayIndex === 6) return colors.accent[1][900];
    return colors.gray[900];
  }};
`;

export const ScheduleSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SectionTitle = styled.h4`
  padding: 0 16px;
  ${setTypography(typography.paragraph.p2)};
  letter-spacing: -0.32px;
  color: ${colors.gray[600]};
`;

export const EventList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const EventItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-radius: 16px;
  background-color: ${colors.base.white};
  padding: 12px 18px;
`;

export const EventLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const Dot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 100px;
  background-color: ${({ $color }) => $color};
`;

export const EventTitle = styled.p`
  min-width: 0;
  ${setTypography(typography.paragraph.p3)};
  letter-spacing: -0.32px;
  color: ${colors.gray[900]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EventDate = styled.span<{ $color: string }>`
  flex-shrink: 0;
  ${setTypography(typography.button.button1)};
  letter-spacing: -0.28px;
  color: ${({ $color }) => $color};
`;

export const EmptyState = styled.p`
  padding-top: 120px;
  ${setTypography(typography.paragraph.p3)};
  line-height: 140%;
  color: ${colors.gray[700]};
  text-align: center;

  ${media.tablet} {
    padding-top: 60px;
    ${setTypography(typography.paragraph.p5)};
  }
`;

export const EmptyText = styled.p`
  border-radius: 16px;
  background-color: ${colors.base.white};
  padding: 12px 18px;
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[600]};
`;
