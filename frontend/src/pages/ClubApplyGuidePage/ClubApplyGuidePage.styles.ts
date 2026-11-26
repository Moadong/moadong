// 지원 안내 페이지(남은 시간 카드·일정 타임라인·확인할 점·질문 미리보기) 스타일
import styled, { css } from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';
import { RecruitmentStatus } from '@/types/club';
import { TimelineState } from './applyGuideTimeline';

const CARD_TONE: Record<RecruitmentStatus, { back: string; text: string }> = {
  OPEN: { back: colors.accent[1][500], text: colors.accent[1][950] },
  UPCOMING: { back: colors.accent[1][500], text: colors.accent[1][950] },
  ALWAYS: { back: colors.accent[2][500], text: colors.accent[2][950] },
  CLOSED: { back: colors.gray[100], text: colors.gray[700] },
};

export const Page = styled.main`
  max-width: 640px;
  margin: 0 auto;
  padding: ${HEADER_HEIGHT.desktop + 32}px 20px 140px;
  display: flex;
  flex-direction: column;
  gap: 28px;

  ${media.tablet} {
    padding: 12px 20px 120px;
    gap: 24px;
  }
`;

export const AppSpacer = styled.div`
  height: calc(87px + env(safe-area-inset-bottom));
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-left: -8px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${colors.gray[900]};

  svg {
    transform: rotate(90deg);
  }
`;

export const TopTitle = styled.h1`
  ${setTypography(typography.title.title4)};
  color: ${colors.base.black};

  ${media.tablet} {
    ${setTypography(typography.title.title5)};
  }
`;

export const CountdownCard = styled.section<{
  $status: RecruitmentStatus;
  $isUrgent: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px;
  border-radius: 20px;
  background-color: ${({ $status, $isUrgent }) =>
    $isUrgent ? colors.primary[500] : CARD_TONE[$status].back};
  color: ${({ $status, $isUrgent }) =>
    $isUrgent ? colors.primary[900] : CARD_TONE[$status].text};

  ${media.tablet} {
    padding: 20px;
    border-radius: 18px;
  }
`;

export const CountdownHeadline = styled.p`
  ${setTypography(typography.title.title2)};
  word-break: keep-all;

  ${media.tablet} {
    ${setTypography(typography.title.title3)};
  }
`;

export const CountdownSub = styled.p`
  ${setTypography(typography.paragraph.p3)};
  color: ${colors.gray[800]};

  ${media.tablet} {
    ${setTypography(typography.paragraph.p5)};
  }
`;

export const FactRows = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 14px 0 0;
  padding-top: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  &:empty {
    display: none;
  }

  div {
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: 8px;
    ${setTypography(typography.paragraph.p5)};
    word-break: keep-all;
  }

  dt {
    font-weight: 700;
    color: ${colors.gray[700]};
  }

  dd {
    margin: 0;
    font-weight: 600;
    color: ${colors.gray[950]};
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionTitle = styled.h2`
  ${setTypography(typography.title.title5)};
  color: ${colors.base.black};

  ${media.tablet} {
    ${setTypography(typography.etc.bold18)};
  }
`;

export const SectionHint = styled.p`
  margin-top: -6px;
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[700]};
`;

/* 타임라인 */

export const Timeline = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
`;

export const TimelineItem = styled.li<{ $state: TimelineState }>`
  position: relative;
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 12px;
  padding-bottom: 20px;
  opacity: ${({ $state }) => ($state === 'done' ? 0.55 : 1)};

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 9px;
    top: 20px;
    bottom: 0;
    width: 2px;
    border-radius: 1px;
    background-color: ${colors.gray[300]};
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

export const TimelineDot = styled.span<{ $state: TimelineState }>`
  width: 12px;
  height: 12px;
  margin: 4px 0 0 4px;
  border-radius: 50%;
  ${({ $state }) =>
    $state === 'now'
      ? css`
          background-color: ${colors.primary[900]};
          box-shadow: 0 0 0 4px ${colors.primary[600]};
        `
      : css`
          background-color: ${colors.base.white};
          border: 2px solid
            ${$state === 'done' ? colors.gray[500] : colors.gray[600]};
        `}
`;

export const TimelineBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const TimelineHead = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const TimelineLabel = styled.span`
  ${setTypography(typography.paragraph.p2)};
  color: ${colors.gray[950]};

  ${media.tablet} {
    ${setTypography(typography.paragraph.p5)};
    font-weight: 700;
  }
`;

export const NowBadge = styled.span`
  padding: 1px 7px;
  border-radius: 999px;
  background-color: ${colors.primary[900]};
  color: ${colors.base.white};
  ${setTypography(typography.button.button2)};
`;

export const TimelineMeta = styled.span`
  ${setTypography(typography.paragraph.p5)};
  font-weight: 600;
  color: ${colors.gray[800]};
  word-break: keep-all;
`;

export const TimelineDescription = styled.span`
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[700]};
  word-break: keep-all;
`;

/* 확인할 점 */

export const NoticeList = styled.ul`
  margin: 0;
  padding: 16px 18px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 16px;
  background-color: ${colors.gray[100]};

  li {
    position: relative;
    padding-left: 24px;
    ${setTypography(typography.paragraph.p3)};
    color: ${colors.gray[900]};
    word-break: keep-all;

    ${media.tablet} {
      ${setTypography(typography.paragraph.p5)};
    }

    /* 체크 표시 */
    &::before {
      content: '';
      position: absolute;
      left: 2px;
      top: 4px;
      width: 10px;
      height: 6px;
      border-left: 2px solid ${colors.primary[900]};
      border-bottom: 2px solid ${colors.primary[900]};
      transform: rotate(-45deg);
    }
  }
`;

/* 질문 미리보기 */

export const QuestionList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${colors.gray[300]};

  li {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 12px 2px;
    border-bottom: 1px solid ${colors.gray[300]};
    ${setTypography(typography.paragraph.p3)};
    color: ${colors.gray[900]};
    word-break: keep-all;

    ${media.tablet} {
      ${setTypography(typography.paragraph.p5)};
    }
  }
`;

export const QuestionIndex = styled.span`
  flex-shrink: 0;
  width: 18px;
  ${setTypography(typography.paragraph.p5)};
  font-weight: 700;
  color: ${colors.gray[500]};
  font-variant-numeric: tabular-nums;
`;

export const Required = styled.span`
  margin-left: 2px;
  color: ${colors.primary[900]};
`;

/* 공고 원문 */

export const OriginalToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
  background-color: ${colors.base.white};
  cursor: pointer;
  ${setTypography(typography.paragraph.p5)};
  font-weight: 600;
  color: ${colors.gray[800]};
`;

export const ToggleChevron = styled.span<{ $isOpen: boolean }>`
  display: flex;
  color: ${colors.gray[600]};
  transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});
  transition: transform ${transitions.duration.normal}
    ${transitions.easing.easeInOut};
`;

export const OriginalText = styled.div`
  padding: 16px;
  border-radius: 14px;
  background-color: ${colors.gray[50]};
  ${setTypography(typography.paragraph.p6r)};
  color: ${colors.gray[800]};
  white-space: pre-line;
  overflow-wrap: anywhere;
`;
