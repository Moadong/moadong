import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.base.white};
`;

export const Main = styled.main<{ $topOffset: number }>`
  flex: 1;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: ${({ $topOffset }) => 40 + $topOffset}px 24px 64px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${media.mobile} {
    padding: ${({ $topOffset }) => 24 + $topOffset}px 20px 48px;
  }
`;
