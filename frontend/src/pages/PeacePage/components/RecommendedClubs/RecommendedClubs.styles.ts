import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Notice = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.gray[600]};
`;
