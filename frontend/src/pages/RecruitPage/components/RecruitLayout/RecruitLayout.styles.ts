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
  max-width: 960px;
  margin: 0 auto;
  padding: ${({ $topOffset }) => 56 + $topOffset}px 24px 80px;
  display: flex;
  flex-direction: column;

  ${media.mobile} {
    padding: ${({ $topOffset }) => 24 + $topOffset}px 20px 56px;
  }
`;
