import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
  height: 65px;
  width: 100%;
  background: ${colors.gray[50]};
  box-shadow: inset 0 0 0 1px ${colors.gray[200]};
  border-radius: 14px;
  box-sizing: border-box;
`;

export const Item = styled.div<{ $spread: boolean }>`
  /* 시안 폭(50px)을 기본으로 하되 좁은 화면에서는 줄어들어 넘치지 않게 한다.
     spread면 카드 폭을 항목끼리 고르게 나눈다 */
  flex: ${({ $spread }) => ($spread ? '1 1 0' : '0 1 50px')};
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const Divider = styled.div`
  flex-shrink: 0;
  width: 1px;
  height: 30px;
  /* 구분선 폭(1px)이 항목 간격을 차지하지 않게 양옆으로 0.5px씩 겹친다 */
  margin: 0 -0.5px;
  background: ${colors.gray[300]};
  border-radius: 100px;
`;

export const Label = styled.span`
  ${setTypography(typography.button.button2)}
  color: ${colors.gray[600]};
`;

export const Count = styled.span<{ $isTotal: boolean }>`
  ${setTypography(typography.title.title6)}
  color: ${({ $isTotal }) =>
    $isTotal ? colors.primary[800] : colors.base.black};
`;
