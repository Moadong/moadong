import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100dvh;
  background: #fff;

  ${media.tablet} {
    max-width: 500px;
    margin: 0 auto;
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);
  }

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
`;

export const IntroducePageHeader = styled.header`
  width: 100%;
  background: #fff;
`;
export const IntroducePageFooter = styled.footer`
  background: #fff;
  border-top: 1px solid #eee;
`;
export const Main = styled.main`
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
`;
