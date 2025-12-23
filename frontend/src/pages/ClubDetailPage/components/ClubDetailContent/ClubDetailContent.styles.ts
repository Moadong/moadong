import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';

const setTypography = (typo: { size: string; weight: number }) => `
  font-size: ${typo.size};
  font-weight: ${typo.weight};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 16px 0;

  ${media.mobile} {
    padding: 20px 0;
    gap: 20px;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SectionTitle = styled.h2`
  margin-left: 4px;
  ${setTypography(typography.title.title5)};
  color: ${colors.gray[800]};

  ${media.mobile} {
    ${setTypography(typography.title.title7)};
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  padding: 20px;
  gap: 8px;
  background-color: ${colors.gray[100]};

  ${media.mobile} {
    padding: 16px;
    gap: 10px;
  }
`;

export const Text = styled.p`
  ${setTypography(typography.paragraph.p3)};
  color: ${colors.gray[800]};
  white-space: pre-line;
  line-height: 1.5;

  ${media.mobile} {
    ${setTypography(typography.paragraph.p6)};
  }
`;

export const AwardGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SemesterBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 50px;
  background-color: ${colors.gray[400]};
  color: ${colors.gray[800]};
  ${setTypography(typography.paragraph.p5)};
  font-weight: 600;
  align-self: flex-start;

  ${media.mobile} {
    ${setTypography(typography.paragraph.p6)};
    font-weight: 600;
  }
`;

export const AwardList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-left: 6px;
`;

export const AwardItem = styled.li`
  ${setTypography(typography.paragraph.p4)};
  color: ${colors.gray[800]};
  display: flex;
  align-items: flex-start;
  gap: 8px;

  &::before {
    content: '•';
    color: ${colors.gray[800]};
  }

  ${media.mobile} {
    ${setTypography(typography.paragraph.p6)};
  }
`;
