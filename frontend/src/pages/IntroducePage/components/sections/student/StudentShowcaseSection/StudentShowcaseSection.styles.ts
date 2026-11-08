// 학생 기능 줄 화면 안의 간격, 동아리 태그 줄, 홍보 카드 두 장 스타일
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/* 홍보 게시판처럼 포스터 카드를 두 장씩 나란히 둔다 */
export const PromotionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

/* 실제 동아리 달력은 날짜 칸 폭이 정해져 있어, 320px대 폰에서는 칸에 맞게 살짝 줄인다 */
export const CalendarFit = styled.div`
  ${media.mini_mobile} {
    zoom: 0.86;
  }
`;
