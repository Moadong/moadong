import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

/** 종료 날짜를 '없음'(무기한)으로 되돌리는 버튼 */
export const ClearButton = styled.button`
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 12px;
  /* 회색이면 비활성으로 읽혀, 저장 버튼과 같은 활성 버튼 색을 쓴다 */
  background: ${colors.primary[900]};
  color: ${colors.base.white};
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
`;
