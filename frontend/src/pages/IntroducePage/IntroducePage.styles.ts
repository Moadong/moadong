import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100dvh;
  background: ${colors.base.white};

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
  background: ${colors.base.white};
`;
export const IntroducePageFooter = styled.footer`
  position: relative;
  z-index: 1;
  background: ${colors.base.white};
  border-top: 1px solid ${colors.gray[250]};
`;
export const Main = styled.main`
  /* 섹션 뒤 장식 도형(z-index:-1)이 본문 아래, 페이지 배경 위에 놓이도록 쌓임 맥락을 만든다 */
  position: relative;
  z-index: 1;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* hidden은 스크롤 컨테이너를 만들어 상단 토글의 sticky를 깨뜨려서 clip을 쓴다 */
  overflow-x: clip;
`;

/* 운영진 쇼케이스 코드를 받는 동안 아래 섹션이 튀어 오르지 않게 자리를 잡아 둔다 */
export const ShowcaseFallback = styled.div`
  width: 100%;
  min-height: 100vh;
`;

/* 운영진 대시보드 코드를 받는 동안 첫 화면 높이가 튀지 않게 자리를 잡아 둔다 */
export const VisualFallback = styled.div`
  width: 100%;
  height: 560px;
`;
