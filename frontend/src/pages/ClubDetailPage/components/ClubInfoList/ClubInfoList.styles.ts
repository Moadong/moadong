// 모바일 아이콘 정보 목록 스타일
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const List = styled.ul`
  margin: 0;
  padding: 18px 20px 22px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Row = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const IconBox = styled.span`
  flex-shrink: 0;
  display: flex;
  margin-top: 1px;
  color: ${colors.gray[600]};
`;

export const RowText = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 8px;
  row-gap: 2px;
  min-width: 0;
  ${setTypography(typography.paragraph.p3)};
  color: ${colors.gray[900]};
  word-break: keep-all;

  ${media.tablet} {
    ${setTypography(typography.paragraph.p5)};
  }
`;

export const RowLabel = styled.span`
  flex-shrink: 0;
  font-weight: 700;
  color: ${colors.gray[800]};
  margin-right: 4px;
`;

export const MutedText = styled.p`
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[700]};
  padding-top: 1px;
`;

export const InlineLink = styled.button`
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.accent[1][950]};
  text-decoration: underline;
  text-underline-offset: 3px;
`;
