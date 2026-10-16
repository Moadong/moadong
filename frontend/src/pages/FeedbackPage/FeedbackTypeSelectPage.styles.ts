import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: 500px;
  min-height: 100dvh;
  margin: 0 auto;
  background: ${colors.base.white};
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 33px;
  width: 100%;
  max-width: 337px;
  margin: 0 auto;
`;

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h1`
  ${setTypography(typography.title.title4)};
  color: ${colors.base.black};
  letter-spacing: -0.44px;
`;

export const Description = styled.p`
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[900]};
  letter-spacing: -0.28px;
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
