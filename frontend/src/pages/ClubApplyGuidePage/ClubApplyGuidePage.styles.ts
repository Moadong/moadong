// 지원 안내 페이지 스타일. 카드·배지 없이 글자 크기와 가는 선만으로 위계를 만든다
import styled, { css } from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';
import { TimelineState } from './applyGuideTimeline';

const DATE_COLUMN = 112;
const DATE_COLUMN_MOBILE = 92;

export const Page = styled.main`
  max-width: 600px;
  margin: 0 auto;
  padding: ${HEADER_HEIGHT.desktop + 32}px 24px 160px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  ${media.tablet} {
    padding: 12px 20px 130px;
    gap: 36px;
  }
`;

export const AppSpacer = styled.div`
  height: calc(87px + env(safe-area-inset-bottom));
`;

export const BackLink = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin: 0 0 -24px -6px;
  padding: 6px 6px 6px 0;
  border: none;
  background: none;
  cursor: pointer;
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[700]};

  svg {
    transform: rotate(90deg);
  }

  &:hover {
    color: ${colors.gray[950]};
  }
`;

export const Hero = styled.header`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Eyebrow = styled.p`
  ${setTypography(typography.paragraph.p5)};
  font-weight: 600;
  color: ${colors.gray[600]};
`;

const HEADLINE_COLOR = {
  default: colors.base.black,
  urgent: colors.primary[900],
  muted: colors.gray[700],
} as const;

export const Headline = styled.h1<{ $tone: keyof typeof HEADLINE_COLOR }>`
  ${setTypography(typography.title.title2)};
  letter-spacing: -0.02em;
  color: ${({ $tone }) => HEADLINE_COLOR[$tone]};
  word-break: keep-all;

  ${media.tablet} {
    ${setTypography(typography.etc.bold28)};
  }
`;

export const SubLine = styled.p`
  ${setTypography(typography.paragraph.p4)};
  color: ${colors.gray[700]};
`;

export const FactList = styled.dl`
  margin: 0;
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${colors.gray[950]};

  > div {
    display: grid;
    grid-template-columns: ${DATE_COLUMN}px 1fr;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid ${colors.gray[300]};

    ${media.tablet} {
      grid-template-columns: ${DATE_COLUMN_MOBILE}px 1fr;
      padding: 13px 0;
    }
  }

  dt {
    ${setTypography(typography.paragraph.p5)};
    color: ${colors.gray[600]};
  }

  dd {
    margin: 0;
    ${setTypography(typography.paragraph.p3)};
    font-weight: 600;
    color: ${colors.gray[950]};
    word-break: keep-all;

    ${media.tablet} {
      ${setTypography(typography.paragraph.p5)};
      font-weight: 600;
    }
  }
`;

export const ValueNote = styled.span`
  display: block;
  margin-top: 2px;
  ${setTypography(typography.paragraph.p6)};
  font-weight: 400;
  color: ${colors.gray[600]};
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SectionTitle = styled.h2`
  ${setTypography(typography.title.title6)};
  color: ${colors.base.black};
`;

/* 일정: 왼쪽 날짜, 오른쪽 할 일 */

export const Schedule = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid ${colors.gray[300]};
`;

export const ScheduleRow = styled.li<{ $state: TimelineState }>`
  display: grid;
  grid-template-columns: ${DATE_COLUMN}px 1fr;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid ${colors.gray[300]};

  ${media.tablet} {
    grid-template-columns: ${DATE_COLUMN_MOBILE}px 1fr;
  }

  ${({ $state }) =>
    $state === 'done' &&
    css`
      color: ${colors.gray[500]};

      strong {
        color: ${colors.gray[600]};
      }
    `}

  ${({ $state }) =>
    $state === 'now' &&
    css`
      > span:first-child {
        color: ${colors.primary[900]};
        font-weight: 700;
      }
    `}
`;

export const ScheduleWhen = styled.span`
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[700]};
  word-break: keep-all;
`;

export const ScheduleWhat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  word-break: keep-all;

  strong {
    ${setTypography(typography.paragraph.p3)};
    font-weight: 600;
    color: ${colors.gray[950]};

    ${media.tablet} {
      ${setTypography(typography.paragraph.p5)};
      font-weight: 600;
    }
  }

  span {
    ${setTypography(typography.paragraph.p6)};
    color: ${colors.gray[600]};
  }
`;

/* 알아둘 점 */

export const PlainList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid ${colors.gray[300]};

  li {
    padding: 13px 0;
    border-bottom: 1px solid ${colors.gray[300]};
    ${setTypography(typography.paragraph.p4)};
    line-height: 160%;
    color: ${colors.gray[900]};
    word-break: keep-all;

    ${media.tablet} {
      ${setTypography(typography.paragraph.p6)};
      line-height: 160%;
    }
  }
`;

/* 질문 미리보기 */

export const QuestionList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid ${colors.gray[300]};

  li {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 8px;
    padding: 13px 0;
    border-bottom: 1px solid ${colors.gray[300]};
    ${setTypography(typography.paragraph.p4)};
    color: ${colors.gray[900]};
    word-break: keep-all;

    ${media.tablet} {
      ${setTypography(typography.paragraph.p6)};
    }
  }
`;

export const QuestionNumber = styled.span`
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[500]};
  font-variant-numeric: tabular-nums;
`;

export const TextButton = styled.button`
  align-self: flex-start;
  padding: 2px 0;
  border: none;
  background: none;
  cursor: pointer;
  ${setTypography(typography.paragraph.p5)};
  font-weight: 600;
  color: ${colors.gray[700]};
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: ${colors.gray[400]};

  &:hover {
    color: ${colors.gray[950]};
  }
`;

export const OriginalText = styled.div`
  padding-left: 14px;
  border-left: 2px solid ${colors.gray[300]};
  ${setTypography(typography.paragraph.p6r)};
  color: ${colors.gray[800]};
  white-space: pre-line;
  overflow-wrap: anywhere;
`;
