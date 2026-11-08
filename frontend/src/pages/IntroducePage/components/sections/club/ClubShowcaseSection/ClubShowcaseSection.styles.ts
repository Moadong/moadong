// 운영진 쇼케이스 카드 안에서 실제 컴포넌트를 쌓고, 데스크탑 전용 화면을 좁은 폭에서 축소하는 스타일
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* 지원서 빌더는 데스크탑 레이아웃이라 데스크탑 크기로 그린 뒤 화면 폭에 맞게 줄여 보여준다 */
export const DesktopOnlyScale = styled(Stack)`
  width: 560px;
  zoom: 0.68;

  ${media.tablet} {
    zoom: 0.46;
  }
`;

/* 홍보 카드는 포스터가 길어 화면 칸 안에 카드 전체(포스터·제목·날짜)가 들어오도록 폭을 줄인다 */
export const PromotionFit = styled.div`
  width: 300px;
  margin: 0 auto;

  ${media.tablet} {
    width: 220px;
  }
`;
