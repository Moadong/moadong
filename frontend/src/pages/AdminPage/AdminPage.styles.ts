import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Background = styled.div`
  background-color: ${colors.gray[200]};
  min-height: 100vh;

  ${media.tablet} {
    background-color: ${colors.base.white};
  }
`;

export const Layout = styled.div`
  display: flex;
  gap: 30px;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  padding-top: 110px;

  ${media.tablet} {
    padding-top: 0;
    gap: 0;
  }
`;

export const MainContent = styled.main`
  width: 100%;
  max-width: 960px;
  background-color: ${colors.base.white};
  padding: 54px;
  border-radius: 20px;
  margin-bottom: 50px;

  ${media.tablet} {
    padding: 0;
    border-radius: 0;
    margin-bottom: 0;
  }
`;
