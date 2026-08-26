import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.button<{ $backgroundColor: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 64px;
  /* 시안 패딩은 18px이지만 border 5px이 박스 안에 그려진다. 5+13이라야 내용이 18px에서 시작한다 */
  padding: 13px;
  border: 5px solid ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 5px 20px 20px 20px;
  background: linear-gradient(
    to left,
    ${({ $backgroundColor }) => $backgroundColor} 9.884%,
    ${colors.base.white}
  );
  cursor: pointer;
`;

/** 시안(11274:1398): 26px 프레임 안에 21.667px 글리프. 내보낸 SVG엔 여백이 없어 박스로 채운다 */
export const IconBox = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
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
