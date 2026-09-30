import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { PEACE_COLUMN_MAX_WIDTH } from '../../constants/layout';

/** 칼럼 바깥(넓은 화면)은 단색. 모바일에서는 칼럼이 화면을 다 채워 보이지 않는다 */
export const PageWrapper = styled.div<{ $tint?: string }>`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${({ $tint, theme }) => $tint ?? theme.colors.base.white};
`;

/** 데스크톱에서도 모바일 폭으로 고정해 한 화면에 한 질문·한 카드가 보이게 한다 */
export const Main = styled.main<{ $topOffset: number; $tint?: string }>`
  flex: 1;
  width: 100%;
  max-width: ${PEACE_COLUMN_MAX_WIDTH}px;
  margin: 0 auto;
  padding: ${({ $topOffset }) => 40 + $topOffset}px 24px 48px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: ${({ $tint, theme }) =>
    $tint
      ? `linear-gradient(180deg, ${$tint} 0%, ${theme.colors.base.white} 100%)`
      : 'transparent'};

  ${media.mobile} {
    padding: ${({ $topOffset }) => 24 + $topOffset}px 20px 48px;
  }
`;
