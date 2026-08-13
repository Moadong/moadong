import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.button<{ $backgroundColor: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 64px;
  padding: 18px;
  border: 5px solid ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 5px 20px 20px 20px;
  background: linear-gradient(
    to left,
    ${({ $backgroundColor }) => $backgroundColor} 9.884%,
    ${colors.base.white}
  );
  cursor: pointer;
`;

export const IconBox = styled.span`
  display: flex;
  flex-shrink: 0;
  width: 26px;
  height: 26px;
`;

export const Label = styled.span`
  ${setTypography(typography.paragraph.p3)};
  color: ${colors.gray[900]};
  letter-spacing: -0.32px;
`;

/** 시안: 카드 오른쪽 끝에 붙는 16px 화살표 */
export const Chevron = styled.span`
  display: flex;
  flex-shrink: 0;
  margin-left: auto;
  color: ${colors.base.black};
`;
