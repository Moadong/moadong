import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

/** 강점 칩(#키워드)과 같은 스타일에 분과 색 테두리만 더한다 */
export const Tag = styled.button<{ $accent: string }>`
  min-height: 36px;
  padding: 6px 12px;
  border: 1.5px solid ${({ $accent }) => $accent};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.paragraph.p5)};
  color: ${({ $accent }) => $accent};
  cursor: pointer;

  &:active {
    background: ${({ $accent }) => $accent};
    color: ${({ theme }) => theme.colors.base.white};
  }
`;

export const Notice = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.gray[600]};
`;
