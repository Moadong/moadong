import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { theme } from '@/styles/theme';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  width: 100%;
  max-width: 500px;
  min-height: 100dvh;
  margin: 0 auto;
  padding: 16px;
  background-color: ${theme.colors.base.white};
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
`;

export const Title = styled.h1`
  ${setTypography(typography.title.title4)};
  color: ${theme.colors.base.black};
  letter-spacing: -0.44px;
  padding: 2.5px 2px;
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  text-align: center;
  color: ${theme.colors.gray[600]};
  font-size: 14px;
  line-height: 1.5;
`;

export const CtaButton = styled.button`
  margin-top: 4px;
  padding: 10px 20px;
  border: none;
  border-radius: 100px;
  background-color: ${theme.colors.primary[900]};
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
`;
