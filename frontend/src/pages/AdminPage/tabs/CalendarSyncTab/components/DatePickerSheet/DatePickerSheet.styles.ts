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
  background: ${colors.gray[100]};
  color: ${colors.gray[700]};
  font-size: 0.92rem;
  cursor: pointer;
`;
