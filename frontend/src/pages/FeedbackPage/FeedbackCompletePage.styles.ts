import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 100dvh;
  padding: 0 20px;
  background: ${colors.base.white};
`;

export const Emoji = styled.span`
  font-size: 56px;
  line-height: 1;
`;

export const Title = styled.p`
  ${setTypography(typography.title.title5)};
  color: ${colors.base.black};
  letter-spacing: -0.4px;
`;

export const Description = styled.p`
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[600]};
  letter-spacing: -0.28px;
`;
