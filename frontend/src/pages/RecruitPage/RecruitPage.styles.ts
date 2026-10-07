import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
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

/** 포지션별 카드 색. 개발자는 밤하늘, 디자이너는 물감이 번진 캔버스 */
const CARD_THEMES = {
  developer: {
    background:
      'linear-gradient(150deg, #1E2150 0%, #312B6E 55%, #4A3A94 100%)',
    shadow: 'rgba(49, 43, 110, 0.45)',
    title: colors.base.white,
    summary: 'rgba(255, 255, 255, 0.72)',
    more: colors.secondary[2].main,
  },
  designer: {
    background: `linear-gradient(150deg, #FFF8EE 0%, #FFEFE6 55%, ${colors.secondary[1].back} 100%)`,
    shadow: 'rgba(255, 125, 164, 0.35)',
    title: colors.base.black,
    summary: colors.gray[800],
    more: colors.primary[900],
  },
} as const satisfies Record<RecruitPositionId, Record<string, string>>;

const twinkle = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
`;

export const PositionCard = styled(Link)<{ $variant: RecruitPositionId }>`
  --card-title: ${({ $variant }) => CARD_THEMES[$variant].title};
  --card-summary: ${({ $variant }) => CARD_THEMES[$variant].summary};
  --card-more: ${({ $variant }) => CARD_THEMES[$variant].more};
  --card-shadow: ${({ $variant }) => CARD_THEMES[$variant].shadow};

  position: relative;
  height: 100%;
  min-height: 260px;
  display: flex;
  overflow: hidden;
  padding: 28px 24px;
  border-radius: 24px;
  background: ${({ $variant }) => CARD_THEMES[$variant].background};
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 2px 4px rgba(0, 0, 0, 0.06),
    0 16px 32px -12px var(--card-shadow);
  text-decoration: none;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  [data-part='float'],
  [data-part='float-slow'] {
    transition: transform 0.4s ease;
  }

  [data-part='twinkle'] circle {
    animation: ${twinkle} 2.4s ease-in-out infinite;
  }

  [data-part='twinkle'] circle:nth-child(even) {
    animation-delay: 1.2s;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 4px 8px rgba(0, 0, 0, 0.08),
      0 28px 48px -16px var(--card-shadow);
  }

  &:hover [data-part='float'] {
    transform: translateY(-8px);
  }

  &:hover [data-part='float-slow'] {
    transform: translateY(-4px);
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    [data-part='float'],
    [data-part='float-slow'] {
      transition: none;
    }

    [data-part='twinkle'] circle {
      animation: none;
    }
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
  right: -8px;
  bottom: -12px;
  width: 200px;
  height: 200px;
  filter: drop-shadow(0 12px 16px rgba(0, 0, 0, 0.18));

  svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  ${media.mobile} {
    width: 160px;
    height: 160px;
  }
`;

export const PositionTitle = styled.h3`
  ${({ theme }) => setTypography(theme.typography.title.title4)};
  color: var(--card-title);

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.etc.bold18)};
  }
`;

export const PositionSummary = styled.p`
  flex: 1;
  ${({ theme }) => setTypography(theme.typography.paragraph.p4)};
  color: var(--card-summary);

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.paragraph.p6r)};
  }
`;

export const PositionMore = styled.span`
  ${({ theme }) => setTypography(theme.typography.button.button1)};
  color: var(--card-more);
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.gray[100]};

  ${media.mobile} {
    padding: 20px;
  }
`;

export const ValueTitle = styled.h3`
  ${({ theme }) => setTypography(theme.typography.title.title6)};
  color: ${({ theme }) => theme.colors.base.black};
`;

export const ValueDescription = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p6r)};
  color: ${({ theme }) => theme.colors.gray[800]};
`;

export const ScheduleList = styled.ol`
  display: grid;
  list-style: none;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const ScheduleItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 12px;

  ${media.tablet} {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
  }
`;

export const ScheduleIndex = styled.span`
  ${({ theme }) => setTypography(theme.typography.button.button1)};
  color: ${({ theme }) => theme.colors.primary[900]};
`;

export const ScheduleStep = styled.span`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.base.black};

  ${media.tablet} {
    flex: 1;
  }
`;

export const ScheduleDate = styled.span`
  ${({ theme }) => setTypography(theme.typography.paragraph.p6)};
  color: ${({ theme }) => theme.colors.gray[700]};
`;
