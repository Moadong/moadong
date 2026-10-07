import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { setTypography } from '@/styles/theme/typography';

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

export const PositionCard = styled(Link)`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px 24px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.gray[50]};
  text-decoration: none;
  transition:
    border-color 0.2s,
    background-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[700]};
    background: ${({ theme }) => theme.colors.primary[500]};
  }

  ${media.mobile} {
    padding: 20px;
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
  color: ${({ theme }) => theme.colors.primary[900]};
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
