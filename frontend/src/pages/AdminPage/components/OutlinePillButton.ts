import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

const TONE_COLOR = {
  primary: colors.primary[800],
  gray: colors.gray[700],
} as const;

type Tone = keyof typeof TONE_COLOR;

// 시안(관리자 기본정보 "이미지 수정")은 테두리를 안쪽에 그려 높이 37이다. 1px 테두리를 빼고 세로 패딩을 9로 맞춘다
const OutlinePillButton = styled.button<{ $tone: Tone }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 9px 20px;
  background: ${colors.base.white};
  border: 1px solid ${({ $tone }) => TONE_COLOR[$tone]};
  border-radius: 80px;
  cursor: pointer;
  ${setTypography(typography.button.button2)};
  color: ${({ $tone }) => TONE_COLOR[$tone]};
  transition: all 0.2s;

  &:hover {
    background: ${({ $tone }) => TONE_COLOR[$tone]};
    color: ${colors.base.white};
  }
`;

export default OutlinePillButton;
