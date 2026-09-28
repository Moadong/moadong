import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Tag = styled.button<{ $accent: string }>`
  min-height: 48px;
  padding: 10px 18px;
  border: 1.5px solid ${({ $accent }) => $accent};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.base.black};
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
