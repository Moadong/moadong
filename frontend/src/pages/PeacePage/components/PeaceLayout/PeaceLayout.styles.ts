import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.base.white};
`;

/** 데스크톱에서도 모바일 폭으로 고정해 한 화면에 한 질문·한 카드가 보이게 한다 */
export const Main = styled.main<{ $topOffset: number }>`
  flex: 1;
  width: 100%;
  max-width: 440px;
  min-height: 100dvh;
  margin: 0 auto;
  padding: ${({ $topOffset }) => 40 + $topOffset}px 24px 48px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${media.mobile} {
    padding: ${({ $topOffset }) => 24 + $topOffset}px 20px 48px;
  }
`;
