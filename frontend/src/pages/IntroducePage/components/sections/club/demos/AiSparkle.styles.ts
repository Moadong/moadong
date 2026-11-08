// AI 별 표시의 크기와 뒤에 번지는 그라데이션 빛 스타일
import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Wrap = styled.div`
  position: relative;
  width: 84px;
  height: 84px;

  svg {
    position: relative;
    display: block;
  }
`;

/* 별 뒤로 퍼지는 은은한 빛 */
export const Glow = styled.span`
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${colors.primary[700]},
    ${colors.secondary[6].main},
    ${colors.secondary[4].main}
  );
  filter: blur(22px);
  opacity: 0.35;
`;
