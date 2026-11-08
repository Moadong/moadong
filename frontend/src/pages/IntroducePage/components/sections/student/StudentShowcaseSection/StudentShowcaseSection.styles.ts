// 학생 기능 줄 화면 안의 간격, 동아리 태그 줄, 홍보 카드 두 장 스타일
import styled from 'styled-components';

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
