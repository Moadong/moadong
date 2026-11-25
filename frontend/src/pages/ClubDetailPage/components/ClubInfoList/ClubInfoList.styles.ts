// 아이콘 정보 목록 스타일 (모바일은 평평한 목록, 데스크톱 사이드는 카드)
import styled, { css } from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const List = styled.ul<{ $variant: 'plain' | 'card' }>`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;

  ${({ $variant }) =>
    $variant === 'card'
      ? css`
          padding: 22px 20px;
          border: 1px solid ${colors.gray[300]};
          border-radius: 20px;
          background-color: ${colors.base.white};
        `
      : css`
          padding: 18px 20px 22px;
        `}
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

export const SocialList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const SocialLink = styled.a`
  ${setTypography(typography.paragraph.p3)};
  color: ${colors.gray[900]};
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  ${media.tablet} {
    ${setTypography(typography.paragraph.p5)};
  }
`;
