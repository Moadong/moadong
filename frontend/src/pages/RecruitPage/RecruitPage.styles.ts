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

export const Period = styled.p`
  align-self: flex-start;
  padding: 8px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.primary[900]};
  ${({ theme }) => setTypography(theme.typography.paragraph.p5)};
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

export const PositionMore = styled.span`
  ${({ theme }) => setTypography(theme.typography.button.button1)};
  color: ${({ theme }) => theme.colors.gray[950]};
  text-underline-offset: 4px;
`;

/** 개발자는 하늘, 디자이너는 노란 종이. 그림의 잉크 선과 주황 포인트가 두 카드를 잇는다 */
const CARD_BACKGROUNDS = {
  developer: colors.accent[1][600],
  designer: colors.secondary[2].back,
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

  &:hover ${PositionMore} {
    text-decoration: underline;
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
  width: 200px;
  height: 200px;

  svg {
    width: 100%;
    height: 100%;
  }

  ${media.mobile} {
    width: 160px;
    height: 160px;
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
  grid-template-columns: repeat(4, 1fr);
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
