import styled from 'styled-components';
import { FIXED_BOTTOM_BUTTON_AREA_HEIGHT } from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea.styles';
import { media } from '@/styles/mediaQuery';

export const PageWrapper = styled.div<{ $hasFixedBottomButton: boolean }>`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.base.white};

  /* 태블릿 이하에서 하단 고정 버튼이 푸터·본문 끝을 가리지 않게 */
  ${media.tablet} {
    padding-bottom: ${({ $hasFixedBottomButton }) =>
      $hasFixedBottomButton
        ? `calc(${FIXED_BOTTOM_BUTTON_AREA_HEIGHT}px + env(safe-area-inset-bottom))`
        : '0'};
  }
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
