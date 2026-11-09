import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

/* 소개는 메인 앱과 따로 떨어진 화면이라, 태블릿 폭에서도 500px 칸에 가두지 않고 화면 전체를 쓴다 */
export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100dvh;
  background: ${colors.base.white};
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
  /* 장식 도형이 가로 스크롤을 만들지 않게 자른다 (hidden은 스크롤 컨테이너를 만들어 clip을 쓴다) */
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
