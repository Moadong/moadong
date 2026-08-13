import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-height: 100dvh;
  padding-bottom: 120px;
  background: ${colors.base.white};
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
  background: ${colors.base.white};
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));

  button {
    width: 100%;
    height: 48px;
  }
`;
