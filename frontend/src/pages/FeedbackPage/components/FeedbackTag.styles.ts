import styled from 'styled-components';
import { setTypography, typography } from '@/styles/theme/typography';

/** 시안(11274:13733): 18px 프레임 안에 15px 글리프. 내보낸 SVG엔 여백이 없어 박스로 채운다 */
export const IconBox = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
`;

export const Tag = styled.span<{ $backgroundColor: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 25px;
  padding: 4px 8px;
  border-radius: 8px;
  background: ${({ $backgroundColor }) => $backgroundColor};
  ${setTypography(typography.button.button2)};
  color: ${({ $color }) => $color};
  letter-spacing: -0.24px;
  white-space: nowrap;
`;
