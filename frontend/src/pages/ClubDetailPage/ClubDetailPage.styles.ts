import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import {
  CalendarCard as ScheduleCalendarCard,
  Container as ScheduleCalendarContainer,
  EventItem as ScheduleEventItem,
  SectionTitle as ScheduleListTitle,
} from '@/pages/ClubDetailPage/components/ClubScheduleCalendar/ClubScheduleCalendar.styles';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';

// 데스크톱 오른쪽 정보 카드 폭
const ASIDE_WIDTH = 340;
const ASIDE_WIDTH_NARROW = 280;

/* ── LegacyClubDetailPage가 함께 쓰는 스타일 ─────────────────────────── */

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;

  ${media.tablet} {
    padding-bottom: 60px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  margin-top: 100px;

  ${media.laptop} {
    padding: 0 20px;
  }

  ${media.tablet} {
    flex-direction: column;
    padding: 0;
    gap: 0;
    max-width: 100%;
    margin-top: 0;
  }
`;

export const RightSection = styled.div`
  width: 100%;

  ${media.tablet} {
    border-top: 6px solid ${colors.gray[200]};
    padding-top: 12px;
  }
`;

export const AppSpacer = styled.div`
  height: calc(71px + env(safe-area-inset-bottom));

  ${media.tablet} {
    height: calc(87px + env(safe-area-inset-bottom));
  }
`;

export const TabContent = styled.div`
  animation: fadeIn ${transitions.duration.normal}
    ${transitions.easing.easeInOut};

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/* ── 상세페이지 ──────────────────────────────────────────────────────── */

export const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: ${HEADER_HEIGHT.desktop + 24}px;
  background-color: ${colors.base.white};

  ${media.tablet} {
    padding-top: 0;
    padding-bottom: 60px;
  }
`;

export const Inner = styled.div`
  max-width: 1180px;
  margin: 0 auto;

  ${media.laptop} {
    padding: 0 20px;
  }

  ${media.tablet} {
    padding: 0;
  }
`;

export const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) ${ASIDE_WIDTH}px;
  gap: 48px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr) ${ASIDE_WIDTH_NARROW}px;
    gap: 28px;
  }

  ${media.tablet} {
    display: block;
  }
`;

export const Main = styled.div`
  min-width: 0;
`;

export const Aside = styled.aside`
  position: sticky;
  top: ${HEADER_HEIGHT.desktop + 24}px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
`;

export const Divider = styled.div`
  height: 8px;
  background-color: ${colors.gray[200]};
`;

// 부원 투표 1위 키워드를 요약 바로 아래에 한 줄로 띄운다
export const Highlight = styled.p<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 14px;
  background-color: ${({ $color }) => $color ?? colors.primary[500]};
  ${setTypography(typography.paragraph.p3)};
  color: ${colors.gray[900]};
  word-break: keep-all;

  > span:first-child {
    font-size: 24px;
  }

  strong {
    font-weight: 700;
    color: ${colors.primary[900]};
  }

  ${media.tablet} {
    margin: 4px 20px 0;
    padding: 12px 14px;
    ${setTypography(typography.paragraph.p5)};

    > span:first-child {
      font-size: 20px;
    }
  }
`;

export const MapCard = styled.button`
  display: block;
  width: 100%;
  height: 180px;
  padding: 0;
  border: 1px solid ${colors.gray[300]};
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  font: inherit;
  background-color: ${colors.gray[200]};

  * {
    cursor: pointer !important;
  }

  ${media.tablet} {
    height: 160px;
    border-radius: 16px;
  }
`;

export const MapCaption = styled.p`
  margin-top: 8px;
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[700]};
`;

export const ErrorMessage = styled.p`
  padding: 160px 20px;
  text-align: center;
  ${setTypography(typography.paragraph.p3)};
  color: ${colors.gray[700]};
`;

// 달력은 원래 회색 판 위에 흰 카드를 얹은 탭 화면이라, 본문에서는 판을 걷어내고 카드에 얇은 테두리만 둔다 (상자 안 상자 방지)
export const ScheduleFrame = styled.div`
  ${ScheduleCalendarContainer} {
    padding: 0;
    gap: 12px;
    background-color: transparent;
  }

  ${ScheduleCalendarCard}, ${ScheduleEventItem} {
    border: 1px solid ${colors.gray[300]};
  }

  ${ScheduleListTitle} {
    padding: 0 4px;
  }
`;
