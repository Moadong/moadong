import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 500px;
  min-height: 100dvh;
  margin: 0 auto;
  padding: 0 20px;
  background: ${colors.base.white};
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
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
