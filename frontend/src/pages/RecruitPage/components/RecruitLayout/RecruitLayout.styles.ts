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
  /* 한글이 어절 중간에서 끊기지 않게 한다. 긴 영단어는 overflow-wrap이 받는다 */
  word-break: keep-all;
  overflow-wrap: break-word;

  ${media.mobile} {
    padding: ${({ $topOffset }) => 24 + $topOffset}px 20px 56px;
  }
`;
