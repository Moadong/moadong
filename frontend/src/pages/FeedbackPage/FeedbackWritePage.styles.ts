import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: 500px;
  min-height: 100dvh;
  margin: 0 auto;
  padding-bottom: 120px;
  background: ${colors.base.white};
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 335px;
  margin: 0 auto;
`;

export const Message = styled.p`
  padding: 60px 20px;
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[600]};
  text-align: center;
`;

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const HeadingTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

export const Title = styled.h1`
  ${setTypography(typography.title.title4)};
  color: ${colors.base.black};
  letter-spacing: -0.44px;
`;

export const Description = styled.p`
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[800]};
  letter-spacing: -0.28px;
  /* 기본값은 한글을 음절 단위로 끊는다. 두 줄 이상이면 어절 단위로 넘겨야 한다 */
  word-break: keep-all;
`;

export const ContentField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const TextArea = styled.textarea`
  height: 235px;
  padding: 16px 18px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
  background: ${colors.gray[50]};
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[800]};
  letter-spacing: -0.28px;
  resize: none;
  outline: none;

  &::placeholder {
    color: ${colors.gray[500]};
    line-height: 160%;
  }
`;

export const CharCount = styled.p`
  ${setTypography(typography.button.button1)};
  color: ${colors.gray[500]};
  text-align: right;
  letter-spacing: -0.28px;
`;

/** 시안 주석: 입력 전에는 글자 수도 비활성 색으로 두고, 입력이 시작되면 현재 수만 진해진다 */
export const CharCountValue = styled.span<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? colors.gray[900] : 'inherit')};
`;

export const AttachButton = styled.label<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px 18px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
  background: ${colors.gray[50]};
  cursor: pointer;

  /* 시안: 최대 등록 수를 채우면 비활성화한다 */
  ${({ $disabled }) => $disabled && 'pointer-events: none; cursor: default;'}
`;

/** 시안(11435:18150): 40px 프레임 안에 35.556×27.777 글리프. 내보낸 SVG엔 여백이 없어 박스로 채운다 */
export const AttachIconBox = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;

export const AttachLabel = styled.span<{
  $variant: 'default' | 'max' | 'error';
}>`
  ${({ $variant }) =>
    $variant === 'error'
      ? setTypography(typography.paragraph.p5)
      : setTypography(typography.paragraph.p6)};
  color: ${({ $variant }) =>
    $variant === 'max' ? colors.gray[500] : colors.primary[700]};
  text-align: center;
  letter-spacing: -0.28px;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const BottomArea = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 10px 20px calc(20px + env(safe-area-inset-bottom));
  /* FixedBottomButtonArea와 같게 버튼 바깥은 비운다. filter는 자식까지 먹어서 같이 지운다 */
  background: transparent;

  button {
    width: 100%;
    height: 48px;
  }
`;
