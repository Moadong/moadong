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
  /* 지울 종료 날짜가 있을 때만 누를 수 있어, 저장 버튼과 같은 활성/비활성 색을 쓴다 */
  background: ${colors.primary[900]};
  color: ${colors.base.white};
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    background: ${colors.gray[300]};
    color: ${colors.gray[600]};
    cursor: not-allowed;
  }
`;
