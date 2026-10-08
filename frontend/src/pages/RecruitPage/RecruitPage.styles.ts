import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography } from '@/styles/theme/typography';
import type { RecruitPositionId } from './constants/recruit';

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 64px;

  ${media.mobile} {
    gap: 12px;
    padding-bottom: 40px;
  }
`;

export const Eyebrow = styled.p`
  ${({ theme }) => setTypography(theme.typography.button.button1)};
  color: ${({ theme }) => theme.colors.primary[900]};
  letter-spacing: 0.08em;
`;

export const HeroTitle = styled.h1`
  ${({ theme }) => setTypography(theme.typography.title.title1)};
  color: ${({ theme }) => theme.colors.base.black};
  white-space: pre-line;

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.etc.bold28)};
  }
`;

export const HeroDescription = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p4)};
  color: ${({ theme }) => theme.colors.gray[800]};
  white-space: pre-line;

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.paragraph.p6r)};
  }
`;

/** 모집 기간 배지와 조기 마감 안내를 한 덩어리로 붙인다 */
export const PeriodGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

export const Period = styled.p`
  padding: 8px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.primary[900]};
  ${({ theme }) => setTypography(theme.typography.paragraph.p5)};
`;

export const PeriodNote = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p6)};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 48px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[300]};

  ${media.mobile} {
    gap: 16px;
    padding: 32px 0;
  }
`;

export const SectionTitle = styled.h2`
  ${({ theme }) => setTypography(theme.typography.title.title3)};
  color: ${({ theme }) => theme.colors.base.black};

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.title.title5)};
  }
`;

export const PositionGrid = styled.ul`
  display: grid;
  list-style: none;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const PositionTitle = styled.h3`
  ${({ theme }) => setTypography(theme.typography.title.title4)};
  color: ${({ theme }) => theme.colors.base.black};

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.etc.bold18)};
  }
`;

export const PositionSummary = styled.p`
  flex: 1;
  ${({ theme }) => setTypography(theme.typography.paragraph.p4)};
  color: ${({ theme }) => theme.colors.gray[800]};

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.paragraph.p6r)};
  }
`;

/** 카드 전체가 링크라, 글자 옆 셰브론으로 누를 수 있다는 것만 알린다 */
export const PositionMore = styled.span`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${({ theme }) => setTypography(theme.typography.button.button1)};
  color: ${({ theme }) => theme.colors.gray[950]};

  svg {
    width: 7px;
    height: 12px;
    transition: transform 0.2s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    svg {
      transition: none;
    }
  }
`;

/** 개발자는 하늘, 디자이너는 노란 종이. 오른쪽 아래 그림 쪽만 한 톤 어둡게 깔아 그림을 받친다 */
const CARD_BACKGROUNDS = {
  developer: `linear-gradient(to top left, #BFE3FB, ${colors.accent[1][600]} 75%)`,
  designer: `linear-gradient(to top left, #FFEAB0, ${colors.secondary[2].back} 75%)`,
} as const satisfies Record<RecruitPositionId, string>;

export const PositionCard = styled(Link)<{ $variant: RecruitPositionId }>`
  position: relative;
  height: 100%;
  min-height: 260px;
  display: flex;
  overflow: hidden;
  padding: 28px 24px;
  border-radius: 24px;
  background: ${({ $variant }) => CARD_BACKGROUNDS[$variant]};
  text-decoration: none;

  &:hover ${PositionMore} svg {
    transform: translateX(3px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.gray[950]};
    outline-offset: 3px;
  }

  ${media.mobile} {
    min-height: 220px;
    padding: 24px 20px;
  }
`;

/** 그림이 오른쪽 아래를 차지하므로 글은 왼쪽 위에 둔다 */
export const PositionText = styled.div`
  position: relative;
  z-index: 1;
  width: 58%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PositionArt = styled.div`
  position: absolute;
  right: 0;
  bottom: -8px;
  width: 232px;
  height: 232px;

  svg {
    width: 100%;
    height: 100%;
  }

  ${media.mobile} {
    width: 184px;
    height: 184px;
  }
`;

export const ValueList = styled.ul`
  display: grid;
  list-style: none;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const ValueItem = styled.li`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px 28px;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.gray[100]};

  ${media.tablet} {
    min-height: auto;
  }

  ${media.mobile} {
    padding: 24px 20px;
  }
`;

export const ValueTitle = styled.h3`
  ${({ theme }) => setTypography(theme.typography.title.title4)};
  color: ${({ theme }) => theme.colors.base.black};

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.etc.bold18)};
  }
`;

export const ValueDescription = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p4)};
  color: ${({ theme }) => theme.colors.gray[800]};

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.paragraph.p6r)};
  }
`;

export const ScheduleList = styled.ol`
  display: grid;
  list-style: none;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const ScheduleItem = styled.li`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 24px;

  ${media.tablet} {
    min-height: auto;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    border-radius: 20px;
  }
`;

export const ScheduleIndex = styled.span`
  margin-bottom: auto;
  ${({ theme }) => setTypography(theme.typography.title.title2)};
  color: ${({ theme }) => theme.colors.primary[900]};

  ${media.tablet} {
    margin-bottom: 0;
    ${({ theme }) => setTypography(theme.typography.title.title3)};
  }
`;

export const ScheduleStep = styled.span`
  ${({ theme }) => setTypography(theme.typography.title.title5)};
  color: ${({ theme }) => theme.colors.base.black};

  ${media.tablet} {
    flex: 1;
    ${({ theme }) => setTypography(theme.typography.etc.bold18)};
  }
`;

export const ScheduleDate = styled.span`
  ${({ theme }) => setTypography(theme.typography.paragraph.p4)};
  color: ${({ theme }) => theme.colors.gray[700]};

  ${media.tablet} {
    ${({ theme }) => setTypography(theme.typography.paragraph.p6)};
  }
`;
