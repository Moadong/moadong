import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Item = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

/** 시각적 체크박스를 쓰되 키보드·스크린리더는 실제 input을 쓰게 한다 */
export const Input = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;

  /* input이 투명해 Tab으로 옮겨온 위치를 시각용 상자에 대신 표시한다 */
  &:focus-visible + span {
    outline: 2px solid ${colors.primary[800]};
    outline-offset: 2px;
  }
`;

export const Box = styled.span`
  display: flex;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: 1px solid ${colors.gray[400]};
  border-radius: 6px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const CheckedBox = styled(Box)`
  border: none;
`;

export const Label = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.28px;
  color: ${colors.base.black};
  ${setTypography(typography.paragraph.p5)};
`;
