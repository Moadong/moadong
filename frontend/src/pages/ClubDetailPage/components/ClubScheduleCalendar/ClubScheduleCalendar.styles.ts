import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CalendarCard = styled.section`
  border-radius: 20px;
  border: 1px solid ${colors.gray[200]};
  background-color: ${colors.base.white};
  padding: 16px 14px;
`;

export const MonthHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

export const MonthLabel = styled.h3`
  font-size: 30px;
  line-height: 1;
  font-weight: 700;
  color: ${colors.gray[900]};
`;

export const MonthMoveButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 999px;
  background-color: ${colors.gray[100]};
  color: ${colors.gray[700]};
  font-size: 16px;
  cursor: pointer;
`;

export const WeekdayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
  margin-bottom: 8px;
`;

export const Weekday = styled.span<{ $dayIndex: number }>`
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $dayIndex }) =>
    $dayIndex === 0
      ? colors.secondary[1].main
      : $dayIndex === 6
        ? colors.secondary[4].main
        : colors.gray[700]};
`;

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
`;

export const DayCell = styled.button<{
  $isCurrentMonth: boolean;
  $isSelected: boolean;
}>`
  border: none;
  border-radius: 12px;
  min-height: 54px;
  background-color: ${({ $isSelected }) =>
    $isSelected ? colors.gray[100] : 'transparent'};
  color: ${({ $isCurrentMonth }) =>
    $isCurrentMonth ? colors.gray[900] : colors.gray[500]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  padding: 6px 0;
`;

export const DayNumber = styled.span<{ $highlightColor?: string }>`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  background-color: ${({ $highlightColor }) =>
    $highlightColor ?? 'transparent'};
  color: ${({ $highlightColor }) =>
    $highlightColor ? colors.base.white : 'inherit'};
`;

export const DotRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 6px;
`;

export const Dot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background-color: ${({ $color }) => $color};
`;

export const ScheduleCard = styled.section`
  border-radius: 20px;
  border: 1px solid ${colors.gray[200]};
  background-color: ${colors.base.white};
  padding: 18px 16px;
`;

export const SectionTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.gray[900]};
  margin-bottom: 14px;
`;

export const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EventItem = styled.article`
  border-radius: 12px;
  background-color: ${colors.gray[100]};
  padding: 12px;
`;

export const EventHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

export const EventTitle = styled.p`
  font-size: 17px;
  font-weight: 700;
  color: ${colors.gray[900]};
  overflow-wrap: anywhere;
`;

export const EventDescription = styled.p`
  font-size: 14px;
  line-height: 1.45;
  color: ${colors.gray[700]};
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
  font-size: 15px;
  color: ${colors.gray[600]};
`;

export const EventLink = styled.a`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.gray[800]};
  text-decoration: underline;
  text-underline-offset: 3px;
`;

export const SelectedDateLabel = styled.p`
  font-size: 14px;
  color: ${colors.gray[700]};
  margin-bottom: 10px;
`;

export const MobilePanelHint = styled.p`
  display: none;

  ${media.tablet} {
    display: block;
    font-size: 13px;
    color: ${colors.gray[600]};
    margin-bottom: 8px;
  }
`;
