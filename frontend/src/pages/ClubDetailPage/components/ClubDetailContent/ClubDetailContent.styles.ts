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

export const FaqSection = styled.div`
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.gray[300]};
`;

export const FaqHeader = styled.div`
  padding: 16px;
  border-radius: 14px;
  background-color: ${colors.gray[100]};
  ${setTypography(typography.title.title5)};
  color: ${colors.gray[800]};

  ${media.mobile} {
    ${setTypography(typography.title.title7)};
  }
`;

export const FaqList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FaqItem = styled.div`
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    border-bottom: 1px solid ${colors.gray[200]};
  }
`;

export const QuestionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;

  ${media.mobile} {
    padding: 16px;
  }
`;

export const QuestionText = styled.span`
  ${setTypography(typography.paragraph.p2)};
  font-weight: 600;
  color: ${colors.gray[800]};
  display: flex;
  gap: 8px;
  text-align: left;
  flex: 1;

  &::before {
    content: 'Q.';
    color: ${colors.gray[800]};
    font-weight: 700;
    flex-shrink: 0;
  }

  ${media.mobile} {
    ${setTypography(typography.paragraph.p6)};
  }
`;

export const ArrowIcon = styled.svg<{ $isOpen: boolean }>`
  width: 24px;
  height: 24px;
  color: ${colors.gray[400]};
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  flex-shrink: 0;
`;

export const AnswerContainer = styled.div`
  padding: 0 20px 20px 20px;

  ${media.mobile} {
    padding: 0 16px 16px 16px;
  }
`;

export const AnswerBox = styled.div`
  background-color: ${colors.gray[100]};
  border-radius: 10px;
  padding: 16px;
  ${setTypography(typography.paragraph.p3)};
  color: ${colors.gray[800]};
  line-height: 1.5;
  display: flex;
  gap: 8px;

  ${media.mobile} {
    ${setTypography(typography.paragraph.p6)};
    padding: 12px;
  }

  &::before {
    content: 'A.';
    font-weight: 700;
    color: ${colors.gray[800]};
    flex-shrink: 0;
  }
`;
